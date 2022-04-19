export const surveyPath = {
  get: {
    security: [{
      apiKeyAuth: []
    }],
    tags: ['Enquete'],
    summary: 'api para listar todas enquetes',
    responses: {
      200: {
        description: 'sucesso',
        content: {
          'application/json': {
            schema: {
              $ref: '#/schemas/surveys'
            }
          }
        }
      },
      403: {
        $ref: '#/components/forbidden'
      },
      500: {
        $ref: '#/components/serverError'
      },
      404: {
        $ref: '#/components/notFound'
      }
    }
  }
}
