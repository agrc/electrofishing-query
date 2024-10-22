# Changelog

## [2.0.0-6](https://github.com/agrc/electrofishing-query/compare/v1.3.8...v2.0.0-6) (2024-10-22)


### Features

* add logged out state and refactor filter into it's own component ([ff8c9df](https://github.com/agrc/electrofishing-query/commit/ff8c9df4e60271fbe052f534bd886216687c9edc)), closes [#182](https://github.com/agrc/electrofishing-query/issues/182)
* add root-level error fallback ([493c687](https://github.com/agrc/electrofishing-query/commit/493c6870b9346d57f3db41175e305a5bf0ab8cd1))
* get purpose values from feature service ([8464d7f](https://github.com/agrc/electrofishing-query/commit/8464d7fea1ecb239991652d28c14830b7936775f))
* implement date-range filter ([b2b1541](https://github.com/agrc/electrofishing-query/commit/b2b154119585b5b4d65f61a93d2f570b72e462f6)), closes [#183](https://github.com/agrc/electrofishing-query/issues/183)
* implement location filter ([afebf27](https://github.com/agrc/electrofishing-query/commit/afebf27b821c1f0d5c290dd12b7e7337d7cb5c02))
* implement purpose filter and wire to map ([4737a36](https://github.com/agrc/electrofishing-query/commit/4737a36f527b91490dcd1d0e33d8b9612ead3e11))
* implement Species and Length filter ([50ce0fa](https://github.com/agrc/electrofishing-query/commit/50ce0fa67fe6dd1e979ca989d77609b3e4716a5e)), closes [#183](https://github.com/agrc/electrofishing-query/issues/183) [#45](https://github.com/agrc/electrofishing-query/issues/45)
* wire up firebase auth proxy for arcgis server requests ([d3475f8](https://github.com/agrc/electrofishing-query/commit/d3475f8b571e001e71387961ca325db09f33d95e))
* wire up lake and stream map controls ([31661a6](https://github.com/agrc/electrofishing-query/commit/31661a6e119c0ba057290e51b1b5f53f4b2568b5))


### Bug Fixes

* add missing env var ([91d13f9](https://github.com/agrc/electrofishing-query/commit/91d13f93a22a8bc2ce61db0b5702eaddd7ba1d8b))
* **functions:** remove unnecessary env var ([a68cbc9](https://github.com/agrc/electrofishing-query/commit/a68cbc9fd328bd4e960c163329d359e989dd30e3))
* **function:** upgrade to v2 syntax ([a365d16](https://github.com/agrc/electrofishing-query/commit/a365d16ec49b3dd4e1f326027493d12f4662e255))
* get rid of "failed to load basemap" console error from esri js ([713dcc1](https://github.com/agrc/electrofishing-query/commit/713dcc1e8dcd6791a0385fd3fc4e0af00af28b31))
* get rid of aria label warning in console ([4a3cb9a](https://github.com/agrc/electrofishing-query/commit/4a3cb9a795878903d3d972b75f9a3d307720df8b))
* linting ([f914d5f](https://github.com/agrc/electrofishing-query/commit/f914d5fb5df554215d05ad7a389115c189cd2057))
* set env vars for function via .env file ([cfc1115](https://github.com/agrc/electrofishing-query/commit/cfc11153fdf6ed03b5aa994f653eadd53696c8d5))
* title ([c91b1cb](https://github.com/agrc/electrofishing-query/commit/c91b1cbec9a5bf520933b69dbe1e391857c0762e))


### Dependencies

* dependency updates 🌲 ([86f1ba2](https://github.com/agrc/electrofishing-query/commit/86f1ba275ccd6408c6097c92166440114c7ea0af))
* **dev:** bump eslint-plugin-react-hooks from 5.1.0-rc-fb9a90fa48-20240614 to 5.1.0-rc.0 ([#197](https://github.com/agrc/electrofishing-query/issues/197)) ([cd9007d](https://github.com/agrc/electrofishing-query/commit/cd9007d0caa93178ae6db2ed7d456ab56bebb4c5))
* package audit fix ([c630157](https://github.com/agrc/electrofishing-query/commit/c630157e49f7fc23bc859ce8d2ca831e93ab4fa8))
* update packages ([fc0e5d6](https://github.com/agrc/electrofishing-query/commit/fc0e5d6cd300555f3874439799a28a4e1ed25a76))


### Documentation

* add copy step ([bda780a](https://github.com/agrc/electrofishing-query/commit/bda780acfa1899ea940489020acc21b530b5c8ed))
* add local dev setup instructions ([e9348a3](https://github.com/agrc/electrofishing-query/commit/e9348a3be58c6756c83ca07f114d2fba6bf1e3c2))
* fix secrets template file and add dev step step ([b10a7ed](https://github.com/agrc/electrofishing-query/commit/b10a7ed0c3b036a950af7bb5ba0e297acdec02ca))


### Styles

* add border around light mode map and match bottom border ([237639f](https://github.com/agrc/electrofishing-query/commit/237639f22fe8f0b57257e58a1bcaad0a782f37a7))

## [2.0.0-4](https://github.com/agrc/electrofishing-query/compare/v2.0.0-3...v2.0.0-4) (2024-08-26)


### Features

* add logged out state and refactor filter into it's own component ([212e73e](https://github.com/agrc/electrofishing-query/commit/212e73ef591aefae02b1eeed6f2e355da6debd3d)), closes [#182](https://github.com/agrc/electrofishing-query/issues/182)
* add root-level error fallback ([990ba22](https://github.com/agrc/electrofishing-query/commit/990ba22754f1f9ba3f64013754c34347135b6f1e))
* get purpose values from feature service ([06b1fea](https://github.com/agrc/electrofishing-query/commit/06b1fea26f061dbe778fbfb827fbf9e0601fc9e3))
* implement purpose filter and wire to map ([f8debc7](https://github.com/agrc/electrofishing-query/commit/f8debc73a6fb55824fa21c60cdf57d4f9d02c8b6))


### Bug Fixes

* get rid of "failed to load basemap" console error from esri js ([a4c503c](https://github.com/agrc/electrofishing-query/commit/a4c503ca737d45e18e16cc9ec025213bf1a40c3d))
* get rid of aria label warning in console ([d7cb7cf](https://github.com/agrc/electrofishing-query/commit/d7cb7cf00d49370d765b1f93b320dedd17c63969))
* title ([7826019](https://github.com/agrc/electrofishing-query/commit/7826019b4560d025268f80a1dac2db5fb0de1bb4))


### Dependencies

* package audit fix ([88f18ff](https://github.com/agrc/electrofishing-query/commit/88f18ffbcaa4239ffd11b06571ff7818dc2e0a2a))


### Documentation

* add copy step ([855447e](https://github.com/agrc/electrofishing-query/commit/855447e7e39d4b034246a134e774a48a753afab4))
* add local dev setup instructions ([841513e](https://github.com/agrc/electrofishing-query/commit/841513e120f887a381e704e89edbef54b420818c))


### Styles

* add border around light mode map and match bottom border ([01c348b](https://github.com/agrc/electrofishing-query/commit/01c348bbc2ff7564ff7d446e64fd4e9267ce5f4a))

## [2.0.0-3](https://github.com/agrc/electrofishing-query/compare/v2.0.0-2...v2.0.0-3) (2024-08-23)


### Bug Fixes

* set env vars for function via .env file ([199cbbd](https://github.com/agrc/electrofishing-query/commit/199cbbd802186c8e1c29cc30568cd807be977b19))

## [2.0.0-2](https://github.com/agrc/electrofishing-query/compare/v2.0.0-1...v2.0.0-2) (2024-08-23)


### Bug Fixes

* add missing env var ([a1083f3](https://github.com/agrc/electrofishing-query/commit/a1083f34df8f44e90db1d83ec69c56f5428bcca5))

## [2.0.0-1](https://github.com/agrc/electrofishing-query/compare/v2.0.0-0...v2.0.0-1) (2024-08-23)


### Dependencies

* **dev:** bump eslint-plugin-react-hooks from 5.1.0-rc-fb9a90fa48-20240614 to 5.1.0-rc.0 ([#197](https://github.com/agrc/electrofishing-query/issues/197)) ([873146f](https://github.com/agrc/electrofishing-query/commit/873146f2b7fa4398bef8daed8997769edfe7afd0))

## [2.0.0-0](https://github.com/agrc/electrofishing-query/compare/v1.3.6...v2.0.0-0) (2024-08-22)


### Bug Fixes

* **functions:** remove unnecessary env var ([6f748d2](https://github.com/agrc/electrofishing-query/commit/6f748d21fd35f0439dec0dfa9fda3ad54ab31e55))


### Dependencies

* update packages ([ce2ed03](https://github.com/agrc/electrofishing-query/commit/ce2ed031ab57ecb1d3032d3198348dcb27c3737a))

## [1.3.11](https://github.com/agrc/electrofishing-query/compare/v1.3.10...v1.3.11) (2024-10-29)


### Dependencies

* bump the npm_and_yarn group in /functions with 3 updates ([49786cc](https://github.com/agrc/electrofishing-query/commit/49786cc6dd4c12a0a6ababb3a3f16f8b88ff6a6b))

## [1.3.10](https://github.com/agrc/electrofishing-query/compare/v1.3.9...v1.3.10) (2024-10-07)


### Bug Fixes

* **functions:** switch to non-default v1 import ([a4f30e6](https://github.com/agrc/electrofishing-query/commit/a4f30e63e5392b7e59346c00bdec2cf3279cf543))

## [1.3.9](https://github.com/agrc/electrofishing-query/compare/v1.3.8...v1.3.9) (2024-10-07)


### Bug Fixes

* **function:** upgrade to v2 syntax ([a365d16](https://github.com/agrc/electrofishing-query/commit/a365d16ec49b3dd4e1f326027493d12f4662e255))

## [1.3.8](https://github.com/agrc/electrofishing-query/compare/v1.3.7...v1.3.8) (2024-10-07)


### Bug Fixes

* workaround breaking change in uglify ([6c9026c](https://github.com/agrc/electrofishing-query/commit/6c9026cddb49ae40ca3ffb6bc90b2771b95c67cb))

## [1.3.7](https://github.com/agrc/electrofishing-query/compare/v1.3.6...v1.3.7) (2024-10-07)


### Dependencies

* bump firebase-functions ([57b8f55](https://github.com/agrc/electrofishing-query/commit/57b8f55b87ff4aa289f6097e81a72148ba56c517))
* bump the npm_and_yarn group in /functions with 7 updates ([5e2b8d0](https://github.com/agrc/electrofishing-query/commit/5e2b8d088eb7091ad81897e65a7ea3deec2da075))
* bump the npm_and_yarn group with 2 updates ([2988f10](https://github.com/agrc/electrofishing-query/commit/2988f10262d30bea90a4dcb96efd53c0914af2d8))
* bump the safe-app-dependencies group with 5 updates ([958b578](https://github.com/agrc/electrofishing-query/commit/958b57883bd931a11adb903f129ec00b9eea603c))

## [1.3.6](https://github.com/agrc/electrofishing-query/compare/v1.3.5...v1.3.6) (2024-07-09)


### Bug Fixes

* fix breaking change in uglify ([ee254dc](https://github.com/agrc/electrofishing-query/commit/ee254dc5da9f30b816996b56e7cb56f3c5b38bee))

## [1.3.5](https://github.com/agrc/electrofishing-query/compare/v1.3.5-0...v1.3.5) (2024-07-09)


### Bug Fixes

* add event id label ([5555ebe](https://github.com/agrc/electrofishing-query/commit/5555ebef033389d6b6ee974f6ca040511d1b2c1c))

## [1.3.5-0](https://github.com/agrc/electrofishing-query/compare/v1.3.4...v1.3.5-0) (2024-07-09)


### Dependencies

* Q1 dependency bumps 🌲 ([0744871](https://github.com/agrc/electrofishing-query/commit/07448715f53edf81bad1be7881c68e8653b226cc))

## [1.3.4](https://github.com/agrc/electrofishing-query/compare/v1.3.3...v1.3.4) (2024-04-12)


### 🌲 Dependencies

* bump dotenv from 16.3.1 to 16.4.5 in /functions in the safe-function-dependencies group ([#158](https://github.com/agrc/electrofishing-query/issues/158)) ([366fa2d](https://github.com/agrc/electrofishing-query/commit/366fa2d1ba91503596fb357ae2bc6bb60788f4aa))
* bump express from 4.18.2 to 4.19.2 in /functions ([#150](https://github.com/agrc/electrofishing-query/issues/150)) ([47ed59a](https://github.com/agrc/electrofishing-query/commit/47ed59afd6ae24c7657abc30ec2c9fe46d1847ca))
* bump follow-redirects from 1.15.2 to 1.15.4 in /functions ([#146](https://github.com/agrc/electrofishing-query/issues/146)) ([7d725b6](https://github.com/agrc/electrofishing-query/commit/7d725b62a63dcb35a174e543aceb2f7337bd0def))
* bump follow-redirects from 1.15.4 to 1.15.6 in /functions ([#154](https://github.com/agrc/electrofishing-query/issues/154)) ([acede37](https://github.com/agrc/electrofishing-query/commit/acede377c65957043771a0f4028bc4e7d1bba0ee))
* bump jose from 4.13.1 to 4.15.5 in /functions ([#155](https://github.com/agrc/electrofishing-query/issues/155)) ([cfb052e](https://github.com/agrc/electrofishing-query/commit/cfb052ed01cb146b74c838c4ec3afea203e17ca9))
* bump protobufjs, firebase-admin and firebase-auth-arcgis-server-proxy in /functions ([#153](https://github.com/agrc/electrofishing-query/issues/153)) ([9eee0fb](https://github.com/agrc/electrofishing-query/commit/9eee0fb35f5d57393d0b8106762abf50c4ce9974))
* bump the safe-app-dependencies group with 5 updates ([#157](https://github.com/agrc/electrofishing-query/issues/157)) ([5aa46f7](https://github.com/agrc/electrofishing-query/commit/5aa46f78c795c5e8121d2d4a55da034f5b9057a5))
* **dev:** bump @babel/traverse from 7.23.0 to 7.23.2 ([8d530ba](https://github.com/agrc/electrofishing-query/commit/8d530ba4c7b7e07cf01ac124652b6dafaa603bd3))
* **dev:** bump ip from 2.0.0 to 2.0.1 ([#149](https://github.com/agrc/electrofishing-query/issues/149)) ([fee7951](https://github.com/agrc/electrofishing-query/commit/fee79519b475d6cc82d2909f4cc61395d69767e5))

## [1.3.4-0](https://github.com/agrc/electrofishing-query/compare/v1.3.3...v1.3.4-0) (2024-04-11)


### 🌲 Dependencies

* bump dotenv from 16.3.1 to 16.4.5 in /functions in the safe-function-dependencies group ([#158](https://github.com/agrc/electrofishing-query/issues/158)) ([366fa2d](https://github.com/agrc/electrofishing-query/commit/366fa2d1ba91503596fb357ae2bc6bb60788f4aa))
* bump express from 4.18.2 to 4.19.2 in /functions ([#150](https://github.com/agrc/electrofishing-query/issues/150)) ([47ed59a](https://github.com/agrc/electrofishing-query/commit/47ed59afd6ae24c7657abc30ec2c9fe46d1847ca))
* bump follow-redirects from 1.15.2 to 1.15.4 in /functions ([#146](https://github.com/agrc/electrofishing-query/issues/146)) ([7d725b6](https://github.com/agrc/electrofishing-query/commit/7d725b62a63dcb35a174e543aceb2f7337bd0def))
* bump follow-redirects from 1.15.4 to 1.15.6 in /functions ([#154](https://github.com/agrc/electrofishing-query/issues/154)) ([acede37](https://github.com/agrc/electrofishing-query/commit/acede377c65957043771a0f4028bc4e7d1bba0ee))
* bump jose from 4.13.1 to 4.15.5 in /functions ([#155](https://github.com/agrc/electrofishing-query/issues/155)) ([cfb052e](https://github.com/agrc/electrofishing-query/commit/cfb052ed01cb146b74c838c4ec3afea203e17ca9))
* bump protobufjs, firebase-admin and firebase-auth-arcgis-server-proxy in /functions ([#153](https://github.com/agrc/electrofishing-query/issues/153)) ([9eee0fb](https://github.com/agrc/electrofishing-query/commit/9eee0fb35f5d57393d0b8106762abf50c4ce9974))
* bump the safe-app-dependencies group with 5 updates ([#157](https://github.com/agrc/electrofishing-query/issues/157)) ([5aa46f7](https://github.com/agrc/electrofishing-query/commit/5aa46f78c795c5e8121d2d4a55da034f5b9057a5))
* **dev:** bump @babel/traverse from 7.23.0 to 7.23.2 ([8d530ba](https://github.com/agrc/electrofishing-query/commit/8d530ba4c7b7e07cf01ac124652b6dafaa603bd3))
* **dev:** bump ip from 2.0.0 to 2.0.1 ([#149](https://github.com/agrc/electrofishing-query/issues/149)) ([fee7951](https://github.com/agrc/electrofishing-query/commit/fee79519b475d6cc82d2909f4cc61395d69767e5))

## [1.3.3](https://github.com/agrc/electrofishing-query/compare/v1.3.2...v1.3.3) (2023-10-09)


### 🐛 Bug Fixes

* use new GA4 analytics id and snippet ([f1d0c83](https://github.com/agrc/electrofishing-query/commit/f1d0c83e497f664359b979a12610d73f3126ab00))


### 🌲 Dependencies

* bump the ci-dependencies group with 1 update ([#130](https://github.com/agrc/electrofishing-query/issues/130)) ([74a9bcc](https://github.com/agrc/electrofishing-query/commit/74a9bccd50f2a8477a54ec087d846191eab407fe))
* bump word-wrap from 1.2.3 to 1.2.5 in /functions ([01dbc64](https://github.com/agrc/electrofishing-query/commit/01dbc649e2618ca9a7679e087a26c6de0251d970))
* **dev:** bump the safe-app-dependencies group with 7 updates ([e4cc878](https://github.com/agrc/electrofishing-query/commit/e4cc878e6e03399ad7fe7c35d2b82dd3e05c5419))

## [1.3.2](https://github.com/agrc/electrofishing-query/compare/v1.3.1...v1.3.2) (2023-09-26)


### 🐛 Bug Fixes

* **functions:** bump deps ([73be300](https://github.com/agrc/electrofishing-query/commit/73be300fe01c4267b5bf04f8c4c6e06ca12de7a4))

## [1.3.1](https://github.com/agrc/electrofishing-query/compare/v1.3.0...v1.3.1) (2023-07-04)


### 🐛 Bug Fixes

* Q3 Dependency Bumps 🌲 ([12ddd6f](https://github.com/agrc/electrofishing-query/commit/12ddd6fc2918ee0d0b42e18c828e034a7ec2b329))

## [1.3.0](https://github.com/agrc/electrofishing-query/compare/v1.0.2-0...v1.3.0) (2023-04-05)


### 📖 Documentation Improvements

* add additional copy files ([adf3478](https://github.com/agrc/electrofishing-query/commit/adf3478b0ea6ae8950857fc87187a0d33d5a5248))
* remove travis badge ([2c042a2](https://github.com/agrc/electrofishing-query/commit/2c042a2b4053f5338dc92fc19304a72307679a26))
* update prod & staging URLs ([0b9817f](https://github.com/agrc/electrofishing-query/commit/0b9817fd6f43da295c390b8dac59bb81710542ab))


### 🚀 Features

* implement security via UtahID/Firebase ([084963d](https://github.com/agrc/electrofishing-query/commit/084963d783fa993b814f6fb64de4b56c7d64cbfd)), closes [#67](https://github.com/agrc/electrofishing-query/issues/67)


### 🐛 Bug Fixes

* add correct domain to esri cors config ([ce2a6fd](https://github.com/agrc/electrofishing-query/commit/ce2a6fd07500fd810fdb9430c24e3551059b7f76))
* add missing dependency ([3c84b11](https://github.com/agrc/electrofishing-query/commit/3c84b11863207bb5a67e4486260c1de6c5d42a0c))
* add verbose flag so that we can see what's failing ([8d97f29](https://github.com/agrc/electrofishing-query/commit/8d97f291ce3cb0c23acb1907053627346a20ad45))
* bump esri package ([009f75f](https://github.com/agrc/electrofishing-query/commit/009f75fade466dad305ad2f125573e6d1037d48a))
* bump functions deps and add dependabot config ([bf1e18c](https://github.com/agrc/electrofishing-query/commit/bf1e18c79a460261de0a951fb6d37a6f1b265919))
* database name in staging ([1bfee0d](https://github.com/agrc/electrofishing-query/commit/1bfee0df072797ff028486cbd344f453be5acabd))
* don't create commit or tag on bump ([816c8dd](https://github.com/agrc/electrofishing-query/commit/816c8dd8f91ecf1682ddb8cd855b3e10a9248ac8))
* fix tests ([2d5b965](https://github.com/agrc/electrofishing-query/commit/2d5b965ea646790f193488fb970be8346a6f0c83))
* handle missing dojo config correctly ([bf3b28f](https://github.com/agrc/electrofishing-query/commit/bf3b28fccf0bee3ad98d90ca98aea0e6b7b2ced6))
* handle missing dojoConfig in deployed app ([19cb7c2](https://github.com/agrc/electrofishing-query/commit/19cb7c2cb2d36ee093f860c9885b888cb8384660))
* implement standardized action workflows ([661a2b0](https://github.com/agrc/electrofishing-query/commit/661a2b01546a15d27b3e15f68b06078bb63ded33)), closes [#68](https://github.com/agrc/electrofishing-query/issues/68)
* include service worker in build ([810a447](https://github.com/agrc/electrofishing-query/commit/810a4478f71259c6f7eb54f511d404b532b40c32))
* install functions deps during deploy ([cd3eb0e](https://github.com/agrc/electrofishing-query/commit/cd3eb0e0e7f70036a7c9af8a1ef3e08f526faebe))
* Q2 Dep Bumps 🌲 ([7f42ab6](https://github.com/agrc/electrofishing-query/commit/7f42ab6061f80cd7b0e2a1a91462523a5b656ee3))
* remove TRANSECT_NUM field ([034cadf](https://github.com/agrc/electrofishing-query/commit/034cadfafcd045432d1a01c446fe50c795b0c897))

## [1.3.0-0](https://github.com/agrc/electrofishing-query/compare/v1.0.2-0...v1.3.0-0) (2023-04-05)


### 📖 Documentation Improvements

* add additional copy files ([adf3478](https://github.com/agrc/electrofishing-query/commit/adf3478b0ea6ae8950857fc87187a0d33d5a5248))
* remove travis badge ([2c042a2](https://github.com/agrc/electrofishing-query/commit/2c042a2b4053f5338dc92fc19304a72307679a26))
* update prod & staging URLs ([0b9817f](https://github.com/agrc/electrofishing-query/commit/0b9817fd6f43da295c390b8dac59bb81710542ab))


### 🚀 Features

* implement security via UtahID/Firebase ([d3f594d](https://github.com/agrc/electrofishing-query/commit/d3f594d0d62b93ee3eb4fc96ef2f90d8e471e43c)), closes [#67](https://github.com/agrc/electrofishing-query/issues/67)


### 🐛 Bug Fixes

* add correct domain to esri cors config ([2c41b78](https://github.com/agrc/electrofishing-query/commit/2c41b78bd9e77374e76bb6cca8ef40131faf7c58))
* add missing dependency ([500cf67](https://github.com/agrc/electrofishing-query/commit/500cf67efa3dfc602b0602a50eb05cc9627f6a86))
* add verbose flag so that we can see what's failing ([b1743b3](https://github.com/agrc/electrofishing-query/commit/b1743b37b0752e52620262130c4f18b7058088f3))
* bump esri package ([02ec536](https://github.com/agrc/electrofishing-query/commit/02ec536fe5caf3012297a6fb70e23b803ca45df1))
* bump functions deps and add dependabot config ([608e019](https://github.com/agrc/electrofishing-query/commit/608e019a8ee5498a40afcafec639184eed8d3261))
* database name in staging ([1bfee0d](https://github.com/agrc/electrofishing-query/commit/1bfee0df072797ff028486cbd344f453be5acabd))
* don't create commit or tag on bump ([c08724a](https://github.com/agrc/electrofishing-query/commit/c08724ac48c40f13d88cd1c40d9f8a7b99fef7d3))
* fix tests ([fcf0b86](https://github.com/agrc/electrofishing-query/commit/fcf0b861282a1671ef26c98da4ebe05e3992656f))
* handle missing dojo config correctly ([11a81c2](https://github.com/agrc/electrofishing-query/commit/11a81c2df0b7ab0a0b1de3134fe94790f395a17b))
* handle missing dojoConfig in deployed app ([9941c32](https://github.com/agrc/electrofishing-query/commit/9941c322b6e802acb0e519353094ad06ebc373e3))
* implement standardized action workflows ([91a6c50](https://github.com/agrc/electrofishing-query/commit/91a6c509b4fd548922ddee857607a994c1a0fcd6)), closes [#68](https://github.com/agrc/electrofishing-query/issues/68)
* include service worker in build ([82f02d7](https://github.com/agrc/electrofishing-query/commit/82f02d70a663baea3a2daaffabb60f171ec7ed40))
* install functions deps during deploy ([fa91f39](https://github.com/agrc/electrofishing-query/commit/fa91f3967c94e442fdd322bf3756fda84a90224f))
* Q2 Dep Bumps 🌲 ([f73bd96](https://github.com/agrc/electrofishing-query/commit/f73bd960e26af3dde4ab2900741466b93179bdc4))
* remove TRANSECT_NUM field ([4a97fbb](https://github.com/agrc/electrofishing-query/commit/4a97fbb205b78e373916184e7b2a2cfd4c79413e))
* trigger release ([13d1433](https://github.com/agrc/electrofishing-query/commit/13d1433a62703510231343e656b06e7a9463e525))

## [1.2.0-9](https://github.com/agrc/electrofishing-query/compare/v1.2.0-7...v1.2.0-9) (2023-03-30)


### 🐛 Bug Fixes

* add missing dependency ([c050cdb](https://github.com/agrc/electrofishing-query/commit/c050cdb7c3d2e74a47adce76f388dcbfcbeb0033))

## [1.2.0-7](https://github.com/agrc/electrofishing-query/compare/v1.2.0-6...v1.2.0-7) (2023-03-29)


### 🐛 Bug Fixes

* add verbose flag so that we can see what's failing ([ad628e4](https://github.com/agrc/electrofishing-query/commit/ad628e44e2101b9fdc0afcd066dfbb688cc96be5))

## [1.2.0-6](https://github.com/agrc/electrofishing-query/compare/v1.2.0-5...v1.2.0-6) (2023-03-29)


### 🐛 Bug Fixes

* add correct domain to esri cors config ([38ae8f8](https://github.com/agrc/electrofishing-query/commit/38ae8f830ea284223ba7eea047e18f333adca03f))
* bump esri package ([cd51408](https://github.com/agrc/electrofishing-query/commit/cd514084c863bc20857b47219c2415bf1a708578))

## [1.2.0-5](https://github.com/agrc/electrofishing-query/compare/v1.2.0-4...v1.2.0-5) (2023-03-28)


### 🐛 Bug Fixes

* include service worker in build ([7a1cb74](https://github.com/agrc/electrofishing-query/commit/7a1cb748b00547b391e56e3116f5d4217374068b))

## [1.2.0-4](https://github.com/agrc/electrofishing-query/compare/v1.2.0-3...v1.2.0-4) (2023-03-28)


### 🐛 Bug Fixes

* trigger release ([beca4d0](https://github.com/agrc/electrofishing-query/commit/beca4d064481d36c06db1fd969a0e52585337212))

## [1.2.0-3](https://github.com/agrc/electrofishing-query/compare/v1.2.0-2...v1.2.0-3) (2023-03-28)


### 🐛 Bug Fixes

* handle missing dojo config correctly ([f5666d7](https://github.com/agrc/electrofishing-query/commit/f5666d7ced6635f587035864afccb98200666527))

## [1.2.0-2](https://github.com/agrc/electrofishing-query/compare/v1.2.0-1...v1.2.0-2) (2023-03-28)


### 🐛 Bug Fixes

* handle missing dojoConfig in deployed app ([e23badb](https://github.com/agrc/electrofishing-query/commit/e23badbee62992ebd472529a6eb3856624a8b06c))

## [1.2.0-1](https://github.com/agrc/electrofishing-query/compare/v1.2.0-0...v1.2.0-1) (2023-03-28)


### 🐛 Bug Fixes

* install functions deps during deploy ([4eb9900](https://github.com/agrc/electrofishing-query/commit/4eb9900fab8d7db00d3240317dc058fca46a5115))

## [1.2.0-0](https://github.com/agrc/electrofishing-query/compare/v1.0.2-0...v1.2.0-0) (2023-03-28)


### 📖 Documentation Improvements

* add additional copy files ([adf3478](https://github.com/agrc/electrofishing-query/commit/adf3478b0ea6ae8950857fc87187a0d33d5a5248))
* remove travis badge ([2c042a2](https://github.com/agrc/electrofishing-query/commit/2c042a2b4053f5338dc92fc19304a72307679a26))
* update prod & staging URLs ([0b9817f](https://github.com/agrc/electrofishing-query/commit/0b9817fd6f43da295c390b8dac59bb81710542ab))


### 🚀 Features

* implement security via UtahID/Firebase ([610a730](https://github.com/agrc/electrofishing-query/commit/610a73069b4eac014d97fca320b6839d55800092)), closes [#67](https://github.com/agrc/electrofishing-query/issues/67)


### 🐛 Bug Fixes

* database name in staging ([1bfee0d](https://github.com/agrc/electrofishing-query/commit/1bfee0df072797ff028486cbd344f453be5acabd))
* don't create commit or tag on bump ([25fa2be](https://github.com/agrc/electrofishing-query/commit/25fa2be9d7981c7016deedc796737a774f408611))
* fix tests ([2e64dd3](https://github.com/agrc/electrofishing-query/commit/2e64dd367736bc6b2fa46565b02179c5b86e906f))
* implement standardized action workflows ([6b1212a](https://github.com/agrc/electrofishing-query/commit/6b1212a646ebf37e2443e5a5df44ecdab91e6f6b)), closes [#68](https://github.com/agrc/electrofishing-query/issues/68)
* remove TRANSECT_NUM field ([286e248](https://github.com/agrc/electrofishing-query/commit/286e24832deac03d988ecfb4ab303a22f3add9e2))

## [1.1.0-0](https://github.com/agrc/electrofishing-query/compare/v1.0.2-0...v1.1.0-0) (2023-03-28)


### 📖 Documentation Improvements

* add additional copy files ([adf3478](https://github.com/agrc/electrofishing-query/commit/adf3478b0ea6ae8950857fc87187a0d33d5a5248))
* remove travis badge ([2c042a2](https://github.com/agrc/electrofishing-query/commit/2c042a2b4053f5338dc92fc19304a72307679a26))
* update prod & staging URLs ([0b9817f](https://github.com/agrc/electrofishing-query/commit/0b9817fd6f43da295c390b8dac59bb81710542ab))


### 🚀 Features

* implement security via UtahID/Firebase ([6298fe2](https://github.com/agrc/electrofishing-query/commit/6298fe215ccc55380674b17881399634271ce374)), closes [#67](https://github.com/agrc/electrofishing-query/issues/67)


### 🐛 Bug Fixes

* database name in staging ([1bfee0d](https://github.com/agrc/electrofishing-query/commit/1bfee0df072797ff028486cbd344f453be5acabd))
* fix tests ([922080f](https://github.com/agrc/electrofishing-query/commit/922080f425df9bcf596581c734a8b5a4e8687771))
* implement standardized action workflows ([f83e056](https://github.com/agrc/electrofishing-query/commit/f83e0562fe4fa52041cc7c5e6834ca58b72b0c78)), closes [#68](https://github.com/agrc/electrofishing-query/issues/68)
* remove TRANSECT_NUM field ([38e2608](https://github.com/agrc/electrofishing-query/commit/38e2608d615ce901c498c6bda55464480720b19a))
