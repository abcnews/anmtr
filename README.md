Anmtr is an amature animation studio. You can use it to put images on a stage and animate some of their properties over anormalised 0 - 1 timeline.

This repo includes two things:

- A svelte-kit app which, when run, is an animation builder, and
- A package that provides utils to help write a frontend runtime for the animations produced.

## Development

```
git clone https://github.com/abcnews/anmtr.git
cd anmtr
npm i
npm run dev
```

## Deployment

This is currenly, in a complicated way, deployed to Vercel using CI on [a fork](https://github.com/drzax/anmtr) of this repo.

## Packaging

Packaging is currently a little complicated due to an [issue related to typescript](https://github.com/sveltejs/kit/issues/2040). The first step is to run the packager.

But assuming you've got a clean git index and you're on the main branch, you should be able to release a new version with:

```
npm run release
```
