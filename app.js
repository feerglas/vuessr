const Vue = require('vue');
const server = require('express')();

const template = require('fs').readFileSync('./index.template.html', 'utf-8');

const renderer = require('vue-server-renderer').createRenderer({
  template,
});

const stencil = require('lyne-test/hydrate');

const context = {
    title: 'vue ssr',
    metas: `
        <meta name="keyword" content="vue,ssr">
        <meta name="description" content="vue srr demo">
    `,
};

server.get('*', (req, res) => {
  const app = new Vue({
    data: {
      url: req.url
    },
    template: `<lyne-slot-component>slot component</lyne-slot-component>`,
  });

  renderer.renderToString(app, context, (err, html) => {
    if (err) {
      res.status(500).end('Internal Server Error')
      return;
    }

    stencil.renderToString(html).then((data) => {
        res.end(data.html);
        console.log(data.html);
    });
  });
})

server.listen(8080);
