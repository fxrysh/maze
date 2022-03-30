import { dirname, resolve } from 'https://deno.land/std@0.132.0/path/mod.ts';

if (Deno.env.get('OS') === 'Windows_NT') {
    const DENO_SDL2_PATH = resolve(dirname(Deno.execPath()), 'lib\\SDL2');
    Deno.env.set('DENO_SDL2_PATH', DENO_SDL2_PATH);
}
