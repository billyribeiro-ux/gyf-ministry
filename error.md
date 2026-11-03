22:48:13.475 - Adjust chunk size limit for this warning via build.chunkSizeWarningLimit.
22:48:23.432 Warning: The following modules failed to locate dependencies that may (or may not) be required for your app to work:

bash -c pnpm run lint

> gyf-ministry@0.0.1 lint /vercel/sandbox/repo
> vp fmt --check . && vp lint .
> Checking formatting...
> All matched files use the correct format.
> Finished in 4648ms on 245 files using 2 threads.
> thread 'tokio-rt-worker' (247) panicked at crates/oxc_allocator/src/pool/fixed_size.rs:112:67:
> called `Result::unwrap()` on an `Err` value: ()
> note: run with `RUST_BACKTRACE=1` environment variable to display a backtrace
>  ELIFECYCLE  Command failed with exit code 134.
> Exited with code 134.
