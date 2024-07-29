# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.4.7](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.4.6...@alistigo/third-party-js-application-client@0.4.7) (2024-07-24)

### Bug Fixes

- **eslint:** update to v8 ([93d8b35](https://github.com/alistigo/core/commit/93d8b35893b96c36ba4f6b84442c9eab32360424))

## [0.4.6](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.4.5...@alistigo/third-party-js-application-client@0.4.6) (2023-06-29)

### Bug Fixes

- **3rd-party-client): ent:** store hash for init case ([f4866ee](https://github.com/alistigo/core/commit/f4866ee74b80851a0f7f50aaf7cf648dff3c5ad8))

## [0.4.5](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.4.4...@alistigo/third-party-js-application-client@0.4.5) (2023-05-17)

### Bug Fixes

- **3rd-party-client:** add some tests + fix somes issues ([19d2cb8](https://github.com/alistigo/core/commit/19d2cb8bdf9d1a7b15825e73b57cfeddde3ddf6a))

## [0.4.4](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.4.3...@alistigo/third-party-js-application-client@0.4.4) (2023-03-20)

### Bug Fixes

- **widget:** fix [#266](https://github.com/alistigo/core/issues/266), [#269](https://github.com/alistigo/core/issues/269), [#225](https://github.com/alistigo/core/issues/225) ([0264a98](https://github.com/alistigo/core/commit/0264a98ffc97ad1fab135bab333653f782035230))

## [0.4.3](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.4.2...@alistigo/third-party-js-application-client@0.4.3) (2023-03-10)

### Bug Fixes

- **bugs:** loader, bind of buttons only when app ready ([12c4b5d](https://github.com/alistigo/core/commit/12c4b5d48cbac6e1ad3a53773db990114373afff))

## [0.4.2](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.4.1...@alistigo/third-party-js-application-client@0.4.2) (2023-02-15)

### Bug Fixes

- **widget:** dont store data on alistigo domain, use 3rd party api to store data on host domain ([ae7758a](https://github.com/alistigo/core/commit/ae7758a925e3303ca65e5865ad1cdf676501905b))

## [0.4.1](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.4.0...@alistigo/third-party-js-application-client@0.4.1) (2023-01-26)

**Note:** Version bump only for package @alistigo/third-party-js-application-client

# [0.4.0](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.3.0...@alistigo/third-party-js-application-client@0.4.0) (2022-10-13)

### Bug Fixes

- **build:** warning pck.json change build path ([d486b80](https://github.com/alistigo/core/commit/d486b8050f49ca9557c8b433fce1f63096ba60b4))

### Features

- **3rd-party-lib:** add version in the code ([4a950da](https://github.com/alistigo/core/commit/4a950da0bc75047f5ed32b3a17371a85ee6d31bd))

# [0.3.0](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.2.0...@alistigo/third-party-js-application-client@0.3.0) (2022-09-30)

### Features

- **3rd-party:** follow hash changes ([b58af82](https://github.com/alistigo/core/commit/b58af82ea1f6721e0088c5f833482ce17fa1fb18))

# [0.2.0](https://github.com/alistigo/core/compare/@alistigo/third-party-js-application-client@0.1.0...@alistigo/third-party-js-application-client@0.2.0) (2022-09-08)

### Bug Fixes

- **3rd-party-lib:** works now perfectly with storybook ([9c7ff80](https://github.com/alistigo/core/commit/9c7ff80e89c091d54fef02e594e588f576e69cd9))

### Features

- **anonymous-user:** merge user ok ([292c3c1](https://github.com/alistigo/core/commit/292c3c1498b50b09af43a4e7169b2c1684ddaa0c))

# 0.1.0 (2022-08-11)

### Bug Fixes

- **packages:** set security to avoid publishing private packages ([4164a08](https://github.com/alistigo/core/commit/4164a08d2b046cc624471892a44cf8ddc250b1a4))
- **widget:** save viewport position in local storage, fix com client control debug ([9cea21e](https://github.com/alistigo/core/commit/9cea21e5a478ce78659de35d747cf740b1d520a6))
- **widget:** viewport sync between host and client ([3f32446](https://github.com/alistigo/core/commit/3f32446588df633ddf729bf0a6404049171aa080))

### Features

- **auth:** add full support widget + playground for dev user id in dev mode ([b954f46](https://github.com/alistigo/core/commit/b954f462784ba7fc9d2dacfaaf62751d3e07de81))
- **auth:** add user auth system on widget with anonymous mode ([db3ec51](https://github.com/alistigo/core/commit/db3ec5165e6b23259f1c8e1e3996c3b8420bb116))
- **components:** setup ViewportViewerContainer ([b8c4fe7](https://github.com/alistigo/core/commit/b8c4fe7c4047f72752d9f1b1b2f84ad87d85a44a))
- **demo:** install widget script ([cdc3d78](https://github.com/alistigo/core/commit/cdc3d78c543bf5baeb5668577683beadcff1b9e5))
- **publish-packages:** set gh action to publish packages ([53be521](https://github.com/alistigo/core/commit/53be521b42203e9bafb95af274c42b75b7943eab))
- **update:** node -> v16 + webpack v5, all start cli works ([563bf5a](https://github.com/alistigo/core/commit/563bf5a8f6e9ea3b327a075acf8931fb1158f225))
