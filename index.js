// Require the framework and instantiate it
const fastify = require('fastify')({ logger: false })
const { promisify } = require('util');
const { search, findProductById, getCart } = require('./utils')


// find product by query string
fastify.get('/search/:query', async function (request, reply) {
  const data = await search(request.params.query)
  return data 
})

// add product to chart by product id
fastify.get('/cart', async (request, reply) => {
  const data = await getCart()
  return data
})

// add product to chart by product id
fastify.get('/add-to-cart/:pid', async (request, reply) => {
  const data = await findProductById(request.params.pid)
  return data
})

// Run the server!
const start = async () => {
  try {
    await fastify.listen(3000)
    // fastify.log.info(`server listening on ${fastify.server.address().port}`)
    console.log(`server listening on ${fastify.server.address().port}`)
  } catch (err) {
    fastify.log.error(err)
    process.exit(1)
  }
}
start()
