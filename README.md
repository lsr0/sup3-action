# S3 via sup3

Sets up [sup3](https://github.com/lsr0/sup3) for S3 interaction by run steps in your job.

This is a cross-platform node action that downloads and adds the `sup3` static binary to your path.

## Inputs

## `access_key`

**Required** The S3 access key.

## `secret_key`

**Required** The S3 secret key.

## Notes

This also has explicit support for MSYS2, necessary because generally adding PATH entries doesn't propagate to MSYS2, and the HOME directory changes. This activates automatically if MSYSTEM is set, ie. if the `msys2/setup-msys2@v2` action occured before this action is run.

## Outputs

## `path`

Path to the sup3 binary.

## `$SUP3_BIN`

Environment variable containing the full path to the sup3 binary (may be without .exe)

## Example usage

```yml
- uses: actions/sup3-action@v0.1
  with:
    access_key: ${{ secrets.AWS_ACCESS_KEY_ID }}
    secret_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}

- name: Upload Artifacts
  run: |
    sup3 upload /output/*.zip /output/*.important s3://a_superb_bucket/some_path/

```


