"use strict";

var _sanitize = require("./sanitize");

// Copyright 2017-2020 @polkadot/types authors & contributors
// This software may be modified and distributed under the terms
// of the Apache-2.0 license. See the LICENSE file for details.
describe('sanitize', () => {
  describe('alias', () => {
    const exec = (0, _sanitize.alias)(['String'], 'Text');
    it('replaces all occurrences for types', () => {
      expect(exec('(String,Address,MasterString,String)')).toEqual('(Text,Address,MasterString,Text)');
    });
    it('replaces actual types, but leaves struct names', () => {
      expect(exec('{"system":"String","versionString":"String"}')).toEqual('{"system":"Text","versionString":"Text"}');
    });
    it('handles the preceding correctly', () => {
      // NOTE This type doesn't make sense
      expect(exec('String String (String,[String;32],String)"String<String>')).toEqual('Text Text (Text,[Text;32],Text)"Text<Text>');
    });
    it('handles emdedded Vec/Tuples', () => {
      const ann = (0, _sanitize.alias)(['Announcement'], 'ProxyAnnouncement');
      expect(ann('(Vec<Announcement>,BalanceOf)')).toEqual('(Vec<ProxyAnnouncement>,BalanceOf)');
    });
  });
  describe('removeColons', () => {
    it('removes preceding ::Text -> Text', () => {
      expect((0, _sanitize.removeColons)()('::Text')).toEqual('Text');
    });
    it('removes middle voting::TallyType -> TallyType', () => {
      expect((0, _sanitize.removeColons)()('voting::TallyType')).toEqual('TallyType');
    });
    it('removes on embedded values (one)', () => {
      expect((0, _sanitize.removeColons)()('(T::AccountId, SpanIndex)')).toEqual('(AccountId, SpanIndex)');
    });
    it('removes on embedded values (all)', () => {
      expect((0, _sanitize.removeColons)()('(T::AccountId, slashing::SpanIndex)')).toEqual('(AccountId, SpanIndex)');
    });
    it('keeps with allowNamespaces', () => {
      expect((0, _sanitize.removeColons)()('::slashing::SpanIndex', {
        allowNamespaces: true
      })).toEqual('slashing::SpanIndex');
    });
  });
});