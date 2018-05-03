<template>
  <div class="hello">
    <select v-model="selectedImage">
      <option v-for="i in img" :value="i">{{ i }}</option>
    </select>
    <select v-model="selectedKernel">
      <option v-for="k, i in kernels" :value="k">{{ i }}</option>
    </select>
    <input type="button" @click="requestConvolution" value="render" />
    <div class="prev">
      <img :src="setImageUrl" v-if="selectedImage">
    </div>
    <div class="next">
      <img :src="setRenderedImageUrl" v-if="renderedImage">
    </div>
  </div>
</template>

<script>
 /* eslint-disable */
 import axios from 'axios';

 export default {
   name: 'HelloWorld',
   data () {
     return {
       img: [],
       kernels: [],
       selectedImage: null,
       renderedImage: null,
       selectedKernel: null,
     }
   },
   computed: {
     setImageUrl () {
       return 'http://localhost:3000/images-available/' + this.selectedImage;
     },
     setRenderedImageUrl () {
       return 'http://localhost:3000/rendered/' + this.renderedImage;
     }
   },
   methods: {
     requestConvolution () {
       let vueInstance = this;
       vueInstance.renderedImage = null;
       if (this.selectedImage !== null && this.selectedKernel !== null ) {
         axios.post('http://localhost:3000/api/v1/convolute', {
           kernel: vueInstance.selectedKernel,
           image: vueInstance.selectedImage
         })
              .then(function(res) {
                vueInstance.renderedImage = res.data.rendered;
              })
       }
     }
   },
   created () {
     let vueInstance = this;
     axios.get('http://localhost:3000/api/v1/files')
          .then(function(res) {
            vueInstance.img = res.data.files;
          })
     axios.get('http://localhost:3000/api/v1/kernels')
          .then(function(res) {
            vueInstance.kernels = res.data.kernels;
          })
   }
 }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

 div.hello {
   height: 100%;
 }

 h1, h2 {
   font-weight: normal;
 }

 ul {
   list-style-type: none;
   padding: 0;
 }

 li {
   display: inline-block;
   margin: 0 10px;
 }

 a {
   color: #42b983;
 }
</style>
