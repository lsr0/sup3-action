# S3 via sup3

Sets up [sup3](https://github.com/lsr0/sup3) for S3 interaction by run steps in your job.

This is a cross-platform node action that downloads and adds the `sup3` static binary to your path.

## Inputs

## `access_key`

**Required** The S3 access key.

## `secret_key`

**Required** The S3 secret key.

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


