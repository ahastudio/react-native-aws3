import { S3Policy } from '../src/S3Policy'

describe('S3Policy.generate', () => {
  let options = {}

  // 2017-04-15T05:00:00.000Z
  const date = new Date(2017, 3, 15, 0, 0, 0, 0)

  beforeEach(() => options = {
    key: 'image.jpg',
    date: date,
    bucket: 'my-s3-bucket',
    contentType: 'image/jpg',
    region: 'us-east-1',
    accessKey: 'AKIAA7AS6DHAD6ASN23',
    secretKey: 'pLx+brfx0u12ERMcJCfNAEOKH+bMk40ZVa7hh8',
  })

  describe('required options', () => {
    test('ensures `key` option is present', () => {
      Reflect.deleteProperty(options, 'key')
      expect(() => S3Policy.generate(options)).toThrow('Must provide `key` option with the object key')
    })

    test('ensures `bucket` option is present', () => {
      Reflect.deleteProperty(options, 'bucket')
      expect(() => S3Policy.generate(options)).toThrow('Must provide `bucket` option with your AWS bucket name')
    })

    test('ensures `contentType` option is present', () => {
      Reflect.deleteProperty(options, 'contentType')
      expect(() => S3Policy.generate(options)).toThrow('Must provide `contentType` option with the object content type')
    })

    test('ensures `region` option is present', () => {
      Reflect.deleteProperty(options, 'region')
      expect(() => S3Policy.generate(options)).toThrow('Must provide `region` option with your AWS region')
    })

    test('ensures `date` option is present', () => {
      Reflect.deleteProperty(options, 'date')
      expect(() => S3Policy.generate(options)).toThrow('Must provide `date` option with the current date')
    })

    test('ensures `accessKey` option is present', () => {
      Reflect.deleteProperty(options, 'accessKey')
      expect(() => S3Policy.generate(options)).toThrow('Must provide `accessKey` option with your AWSAccessKeyId')
    })

    test('ensures `secretKey` option is present', () => {
      Reflect.deleteProperty(options, 'secretKey')
      expect(() => S3Policy.generate(options)).toThrow('Must provide `secretKey` option with your AWSSecretKey')
    })
  })

  it('generates the correct policy', () => {
    const policy = S3Policy.generate(options)

    expect(policy).toHaveProperty('key', 'image.jpg')
    expect(policy).toHaveProperty('acl', 'public-read')
    expect(policy).toHaveProperty('success_action_status', '201')
    expect(policy).toHaveProperty('Content-Type', 'image/jpg')
    expect(policy).toHaveProperty('X-Amz-Algorithm', 'AWS4-HMAC-SHA256')
    expect(policy).toHaveProperty('X-Amz-Date', '20170415T000000Z')
    expect(policy).toHaveProperty('X-Amz-Credential', 'AKIAA7AS6DHAD6ASN23/20170415/us-east-1/s3/aws4_request')
    expect(policy).toHaveProperty('Policy', 'eyJleHBpcmF0aW9uIjoiMjAxNy0wNC0xNVQwNTowNTowMC4wMDBaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoibXktczMtYnVja2V0In0seyJrZXkiOiJpbWFnZS5qcGcifSx7ImFjbCI6InB1YmxpYy1yZWFkIn0seyJzdWNjZXNzX2FjdGlvbl9zdGF0dXMiOiIyMDEifSx7IkNvbnRlbnQtVHlwZSI6ImltYWdlL2pwZyJ9LHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFBN0FTNkRIQUQ2QVNOMjMvMjAxNzA0MTUvdXMtZWFzdC0xL3MzL2F3czRfcmVxdWVzdCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotZGF0ZSI6IjIwMTcwNDE1VDAwMDAwMFoifV19')
    expect(policy).toHaveProperty('X-Amz-Signature', 'fd03e708d832645922d208e9f172cb9f44ca37628a0246ff2f51b3445a561faa')
  })

  it('supports `acl` option', () => {
    const policy = S3Policy.generate({ ...options, acl: 'private' })

    expect(policy).toHaveProperty('key', 'image.jpg')
    expect(policy).toHaveProperty('acl', 'private')
    expect(policy).toHaveProperty('success_action_status', '201')
    expect(policy).toHaveProperty('Content-Type', 'image/jpg')
    expect(policy).toHaveProperty('X-Amz-Algorithm', 'AWS4-HMAC-SHA256')
    expect(policy).toHaveProperty('X-Amz-Date', '20170415T000000Z')
    expect(policy).toHaveProperty('X-Amz-Credential', 'AKIAA7AS6DHAD6ASN23/20170415/us-east-1/s3/aws4_request')
    expect(policy).toHaveProperty('Policy', 'eyJleHBpcmF0aW9uIjoiMjAxNy0wNC0xNVQwNTowNTowMC4wMDBaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoibXktczMtYnVja2V0In0seyJrZXkiOiJpbWFnZS5qcGcifSx7ImFjbCI6InByaXZhdGUifSx7InN1Y2Nlc3NfYWN0aW9uX3N0YXR1cyI6IjIwMSJ9LHsiQ29udGVudC1UeXBlIjoiaW1hZ2UvanBnIn0seyJ4LWFtei1jcmVkZW50aWFsIjoiQUtJQUE3QVM2REhBRDZBU04yMy8yMDE3MDQxNS91cy1lYXN0LTEvczMvYXdzNF9yZXF1ZXN0In0seyJ4LWFtei1hbGdvcml0aG0iOiJBV1M0LUhNQUMtU0hBMjU2In0seyJ4LWFtei1kYXRlIjoiMjAxNzA0MTVUMDAwMDAwWiJ9XX0=')
    expect(policy).toHaveProperty('X-Amz-Signature', 'cbedb7f78d3e3b8d3f62ae177e0ad4ac8459b71340f23a0a84050eb3fb188a95')
  })

  it('supports `successActionStatus` option', () => {
    const policy = S3Policy.generate({ ...options, successActionStatus: 200 })

    expect(policy).toHaveProperty('key', 'image.jpg')
    expect(policy).toHaveProperty('acl', 'public-read')
    expect(policy).toHaveProperty('success_action_status', '200')
    expect(policy).toHaveProperty('Content-Type', 'image/jpg')
    expect(policy).toHaveProperty('X-Amz-Algorithm', 'AWS4-HMAC-SHA256')
    expect(policy).toHaveProperty('X-Amz-Date', '20170415T000000Z')
    expect(policy).toHaveProperty('X-Amz-Credential', 'AKIAA7AS6DHAD6ASN23/20170415/us-east-1/s3/aws4_request')
    expect(policy).toHaveProperty('Policy', 'eyJleHBpcmF0aW9uIjoiMjAxNy0wNC0xNVQwNTowNTowMC4wMDBaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoibXktczMtYnVja2V0In0seyJrZXkiOiJpbWFnZS5qcGcifSx7ImFjbCI6InB1YmxpYy1yZWFkIn0seyJzdWNjZXNzX2FjdGlvbl9zdGF0dXMiOiIyMDAifSx7IkNvbnRlbnQtVHlwZSI6ImltYWdlL2pwZyJ9LHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFBN0FTNkRIQUQ2QVNOMjMvMjAxNzA0MTUvdXMtZWFzdC0xL3MzL2F3czRfcmVxdWVzdCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotZGF0ZSI6IjIwMTcwNDE1VDAwMDAwMFoifV19')
    expect(policy).toHaveProperty('X-Amz-Signature', 'd2b0d4203155251b6c5095aa4ef29de028d54cd74f3e5c12852b0b346c35952d')
  })

  it('supports `timeDelta` option', () => {
    const oneMinute = 60 * 1000

    const policy = S3Policy.generate({ ...options, timeDelta: -oneMinute })

    expect(policy).toHaveProperty('key', 'image.jpg')
    expect(policy).toHaveProperty('acl', 'public-read')
    expect(policy).toHaveProperty('success_action_status', '201')
    expect(policy).toHaveProperty('Content-Type', 'image/jpg')
    expect(policy).toHaveProperty('X-Amz-Algorithm', 'AWS4-HMAC-SHA256')
    expect(policy).toHaveProperty('X-Amz-Date', '20170415T000000Z')
    expect(policy).toHaveProperty('X-Amz-Credential', 'AKIAA7AS6DHAD6ASN23/20170415/us-east-1/s3/aws4_request')
    expect(policy).toHaveProperty('Policy', 'eyJleHBpcmF0aW9uIjoiMjAxNy0wNC0xNVQwNTowNjowMC4wMDBaIiwiY29uZGl0aW9ucyI6W3siYnVja2V0IjoibXktczMtYnVja2V0In0seyJrZXkiOiJpbWFnZS5qcGcifSx7ImFjbCI6InB1YmxpYy1yZWFkIn0seyJzdWNjZXNzX2FjdGlvbl9zdGF0dXMiOiIyMDEifSx7IkNvbnRlbnQtVHlwZSI6ImltYWdlL2pwZyJ9LHsieC1hbXotY3JlZGVudGlhbCI6IkFLSUFBN0FTNkRIQUQ2QVNOMjMvMjAxNzA0MTUvdXMtZWFzdC0xL3MzL2F3czRfcmVxdWVzdCJ9LHsieC1hbXotYWxnb3JpdGhtIjoiQVdTNC1ITUFDLVNIQTI1NiJ9LHsieC1hbXotZGF0ZSI6IjIwMTcwNDE1VDAwMDAwMFoifV19')
    expect(policy).toHaveProperty('X-Amz-Signature', '655f3521436f5fdc2c3da05ddba3b8acc010e87686f68a64ddccd8765f553080')
  })

})
