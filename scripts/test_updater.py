"""Network-free regression tests for safe catalog refresh behavior."""
import unittest, tempfile, json
from pathlib import Path
from unittest.mock import patch
import update_catalog as updater

class RefreshTests(unittest.TestCase):
    def setUp(self):
        self.temp=tempfile.TemporaryDirectory()
        self.root=Path(self.temp.name);(self.root/'data').mkdir()
        self.file=self.root/'data/discovered.json';self.file.write_text('{"items":["preserved"]}')
        self.original=self.file.read_bytes()
    def tearDown(self):self.temp.cleanup()
    def test_partial_failure_keeps_snapshot(self):
        good=b'<div class="game_cell"><div class="game_title"><a href="/one">One</a></div></div>'
        with patch.object(updater,'ROOT',self.root),patch.object(updater,'fetch',side_effect=[(good,'',200),RuntimeError('offline')]):
            with self.assertRaises(RuntimeError):updater.refresh()
        self.assertEqual(self.file.read_bytes(),self.original)
    def test_empty_response_keeps_snapshot(self):
        with patch.object(updater,'ROOT',self.root),patch.object(updater,'fetch',return_value=(b'<html/>','',200)):
            with self.assertRaises(ValueError):updater.refresh()
        self.assertEqual(self.file.read_bytes(),self.original)
    def test_relative_urls_and_mixed_catalog(self):
        html=b'<div class="game_cell"><div class="game_title"><a href="/music">Original Soundtrack</a></div></div><div class="game_cell"><div class="game_title"><a href="https://outside.test/">Reject</a></div></div>'
        with patch.object(updater,'ROOT',self.root),patch.object(updater,'fetch',return_value=(html,'',200)):updater.refresh()
        result=json.loads(self.file.read_text())['items']
        self.assertEqual(len(result),2)
        self.assertTrue(all(x['category']=='Soundtrack' and x['url'].endswith('/music') for x in result))
    def test_reject_non_https(self):
        for url in ('file:///etc/passwd','http://example.com','https://localhost/'):
            with self.assertRaises(ValueError):updater.fetch(url)

if __name__=='__main__':unittest.main()
