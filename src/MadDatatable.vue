<template>
  <div
  class="row"
  style="padding:10px"
  >
    <div class="col-12 col-md-9">
      <slot name="message" />
    </div>
    <div class="col-12 col-md-3">
      <form
        class="form-inline d-flex mx-1 justify-content-end"
        @submit.stop.prevent="doSearch"
      >
        <div class="input-group">
          <input
            v-model="quickSearch"
            type="search"
            placeholder="Quick search"
            class="form-control"
          >
          <div class="input-group-append">
            <button
            class="btn btn-outline-secondary"
            type="submit"
            >
              Search
            </button>
          </div>
        </div>
      </form>
    </div>
    <!-- Using the MadVueDatatable component -->
    <mad-vue-datatable
      ref="table"
      :dtfields="compsdtFields"
      :opts="options"
      v-on="$listeners"
      @reloaded="doReload"
      @table-creating="doCreating"
      @table-created="doCreated"
    >
      <template
      slot="action"
      slot-scope="ctx"
      >
      <slot
      name="custom"
      :ctx="ctx"
      />
      <!-- <button
      v-if="checkActionExist('edit')"
      class="btn btn-success"
      >
      Edit
      </button> -->
      </template>
    </mad-vue-datatable>
  </div>
</template>

<script>
// this demonstrate with buttons and responsive master/details row
import MadVueDatatable from './MadVueDatatable'
export default {
  name: 'App',
  components: { MadVueDatatable },
  props: {
    trigger: {
      type: Object,
      required: false
    },
    dtfields: {
      type: Object,
      required: true
    },
    actionData:{
      type: String,
      required:false,
      default:'id'
    },
    actionLabel:{
      type: String,
      required:false,
      default:'Aksi'
    },
    action:{
      type:Boolean,
      required:false,
      default:false
    },
    buttonFirst:{
      type:Boolean,
      required:false,
      default:true
    },
    url: {
      type: String,
      required: true
    }
  },
  data() {
    const vm = this

    return {
      options: {
        ajax: {
          url: `${this.url}`,
          dataSrc: json => {
            vm.$emit('data', json)
            return json.data
          },
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Role':localStorage.getItem('user_group_id')
          },
          data: Object.assign({}, this.trigger)
        },
        buttons: [],
        /*eslint-disable */
        dom:
          "Btr<'row madvue-footer'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'pl>>",
        /*eslint-enable */
        responsive: true,
        processing: true,
        searching: true,
        searchDelay: 1500,
        destroy: true,
        ordering: true,
        lengthChange: true,
        serverSide: true,
        fixedHeader: true,
        saveState: true
      },
      quickSearch: '',
      details: {}
    }
  },
  computed: {
    compsdtFields(){
      let dd = this.dtfields
      if(this.action){
        if(this.buttonFirst){
          dd = Object.assign({action:{label:this.actionLabel,data:this.actionData,sortable:false,searchable:false}},dd)
        }else{
          dd = Object.assign(dd,{action:{label:this.actionLabel,data:this.actionData,sortable:false,searchable:false}})
        }
      }
      return dd
    }
  },
  methods: {
    checkActionExist(key){
      let exist = this.actions.find(x=>x === key)
      return exist ? true : false
    },
    doSearch() {
      this.$refs.table.search(this.quickSearch)
    },
    doReload(){
      this.$emit('reload')
    },
    doCreating(){
      this.$emit('creating')
    },
    doCreated(){
      this.$emit('created')
    }
  }
}
</script>
