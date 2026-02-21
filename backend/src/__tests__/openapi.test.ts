import { describe, it, expect } from 'vitest'
import { readFileSync } from 'fs'
import { parse } from 'yaml'
import path from 'path'
import SwaggerParser from '@apidevtools/swagger-parser'

const openapiPath = path.resolve(__dirname, '../../../docs/openapi.yaml')

describe('OpenAPI Spec — docs/openapi.yaml', () => {
  it('file dapat dibaca dan di-parse sebagai YAML', () => {
    const content = readFileSync(openapiPath, 'utf-8')
    const spec = parse(content)
    expect(spec).toBeDefined()
    expect(typeof spec).toBe('object')
  })

  it('versi OpenAPI adalah 3.x', () => {
    const spec = parse(readFileSync(openapiPath, 'utf-8'))
    expect(spec.openapi).toMatch(/^3\./)
  })

  it('memiliki info.title dan info.version', () => {
    const spec = parse(readFileSync(openapiPath, 'utf-8'))
    expect(spec.info?.title).toBeTruthy()
    expect(spec.info?.version).toBeTruthy()
  })

  it('memiliki semua endpoint utama terdefinisi', () => {
    const spec = parse(readFileSync(openapiPath, 'utf-8'))
    const paths = Object.keys(spec.paths ?? {})

    expect(paths).toContain('/api/plants')
    expect(paths).toContain('/api/auth/login')
    expect(paths).toContain('/api/categories')
    expect(paths).toContain('/api/scans')
    expect(paths).toContain('/api/stats/summary')
  })

  it('spec valid menurut standar OpenAPI 3.x (swagger-parser)', async () => {
    const api = await SwaggerParser.validate(openapiPath)
    expect(api).toBeDefined()
  })
})
