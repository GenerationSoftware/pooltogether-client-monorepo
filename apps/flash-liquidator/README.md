<p align="center">
  <a href="https://github.com/pooltogether/pooltogether--brand-assets">
    <img src="https://github.com/pooltogether/pooltogether--brand-assets/blob/977e03604c49c63314450b5d432fe57d34747c66/logo/pooltogether-logo--purple-gradient.png?raw=true" alt="PoolTogether Brand" style="max-width:100%;" width="200">
  </a>
</p>

<br />

# 💻 &nbsp; Cabana Flash Liquidator

![next](https://img.shields.io/static/v1?label&logo=nextdotjs&logoColor=white&message=Next.js&color=black)
![ts](https://img.shields.io/badge/typescript-%23007ACC.svg?style=flat&logo=typescript&logoColor=white)
![tailwind](https://img.shields.io/static/v1?label&logo=tailwindcss&logoColor=white&message=tailwind&color=38B2AC)
![version](https://img.shields.io/github/package-json/v/GenerationSoftware/pooltogether-client-monorepo?filename=apps%2Fflash-liquidator%2Fpackage.json&color=brightgreen)

[![Netlify Status](https://api.netlify.com/api/v1/badges/a1303ff0-39a4-48df-b10e-fbeba0d922bf/deploy-status)](https://app.netlify.com/sites/cabana-flash-liquidator/deploys)

# 🏆 &nbsp; Overview

App to flash liquidate yield from any PoolTogether liquidation pair linked to a prize vault.

## 🏎️ &nbsp; Quickstart

### Running Development Server

Run the development server through `pnpm dev`.

Open [http://localhost:3007](http://localhost:3007) on your browser to see the resulting app.

### App Structure

The app follows the following structure:

- `pages` - All of the pages in the app!
- `components` - React components that make up the contents of the pages.
- `hooks` - App-specific hooks not included in other hook packages.
- `constants` - Constant values, references and configurations to deploy and run this app.

### Environment Setup

Add your RPC URLs to `.env.local` for testing. A `.env.example` file is available for reference.

If none are provided, the app will use public RPCs which could potentially get rate-limited.
