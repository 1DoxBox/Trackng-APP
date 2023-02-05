export default {
  mode: 'spa',
  ssr: false,
  render: {
    resourceHints: false,
  },  
  generate: {
    dir: 'MyTracking',
    fallback: '404.html'
  },
  target:'static',
  loading: {
    color: '#ff66cc',
    failedColor:'#e60000',
    height: '5px',
  },
  manifest: {
    theme_color: '#ff66cc',
  },
  transition(to, from) {
    if (!from) {
        return 'slide-left'
    }
    return +to.query.page < +from.query.page ? 'slide-right' : 'slide-left'
  },
  head: {
    title: 'MyTracking',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: '' },
      { name: 'format-detection', content: 'telephone=no' },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      
    ],
    script: [ 
      
    ]
  }, 
  styleResources: {   
    scss: [
      '~/assets/scss/index.scss', 
    ],  
  }, 
  plugins: [ 
    { src: '~/plugins/vuetify.js', mode: 'client' },    
    { src: '~/plugins/select-2.js', mode: 'client' },   
  ], 
  components: true, 
  buildModules: [ 
    '@nuxtjs/eslint-module',
    '@nuxtclub/feathericons',
    '@nuxtjs/vuetify',
    '@nuxtjs/fontawesome', 
  ],  
  modules: [  
    '@nuxtjs/pwa',
    '@nuxtjs/axios', 
    '@nuxtjs/style-resources', 
  ],  
  axios:{ 
    baseURL:'http://localhost:9200/api', 
  }, 
 
  pwa: {
    manifest: {
      lang: 'en',
    },
  },
 
  build: {
    loaders: {
      sass: {
        implementation: require('sass'),
      },
      scss: {
        implementation: require('sass'),
      },
    }, 
  },  
}
