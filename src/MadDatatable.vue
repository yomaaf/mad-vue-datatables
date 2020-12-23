<template>
  <div
  class="row"
  style="padding:10px"
  >
    <!-- Using the MadVueDatatable component -->
    <mad-vue-datatable
      ref="table"
      :dtfields="compsdtFields"
      :opts="options"
      :table-name="tableName"
      :column-filtering="columnFiltering"
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
    },
    columnFiltering:{
      type: Boolean,
      required: false,
      default:false
    },
    tableName:{
      type: String,
      required:false,
      default:'madvuetable'
    },
    language:{
      type: String,
      required:false,
      default:'id'
    }
  },
  data() {
    let languages = {
      en:{
        'sEmptyTable':     'No data available in table',
        'sInfo':           'Showing _START_ to _END_ of _TOTAL_ entries',
        'sInfoEmpty':      'Showing 0 to 0 of 0 entries',
        'sInfoFiltered':   '(filtered from _MAX_ total entries)',
        'sInfoPostFix':    '',
        'sInfoThousands':  ',',
        'sLengthMenu':     'Show _MENU_ entries',
        'sLoadingRecords': 'Loading...',
        'sProcessing':     'Processing...',
        'sSearch':         'Search:',
        'sZeroRecords':    'No matching records found',
        'oPaginate': {
            'sFirst':    '<<',
            'sLast':     '>>',
            'sNext':     '>',
            'sPrevious': '<'
        },
        'oAria': {
            'sSortAscending':  ': activate to sort column ascending',
            'sSortDescending': ': activate to sort column descending'
        }
      },
      id:{
        'sEmptyTable':   'Tidak ada data yang tersedia pada tabel ini',
        'sProcessing':   'Sedang memproses...',
        'sLengthMenu':   'Tampilkan _MENU_ entri',
        'sZeroRecords':  'Tidak ditemukan data yang sesuai',
        'sInfo':         'Menampilkan _START_ sampai _END_ dari _TOTAL_ entri',
        'sInfoEmpty':    'Menampilkan 0 sampai 0 dari 0 entri',
        'sInfoFiltered': '(disaring dari _MAX_ entri keseluruhan)',
        'sInfoPostFix':  '',
        'sSearch':       'Cari:',
        'sUrl':          '',
        'oPaginate': {
            'sFirst':    '<<',
            'sLast':     '>>',
            'sNext':     '>',
            'sPrevious': '<'
        }
      }
    }
    const vm = this

    return {
      options: {
        ajax: {
          url: `${this.url}`,
          dataSrc: (json,xhr) => {
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
          "<'row'<'col-sm-12 col-md-6'l><'col-sm-12 col-md-6'f>><'row'<'col-sm-12'tr>><'row'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'p>>",
        /*eslint-enable */
        responsive: true,
        processing: true,
        searching: true,
        searchDelay: 1500,
        destroy: true,
        orderCellsTop: true,
        ordering: true,
        lengthChange: true,
        serverSide: true,
        fixedHeader: true,
        stateSave: true,
        stateDuration: -1,
        language: languages[vm.language]!==undefined?languages[vm.language]:languages.id
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
          dd = Object.assign({action:{label:this.actionLabel,data:function(data){return data},sortable:false,searchable:false}},dd)
        }else{
          dd = Object.assign(dd,{action:{label:this.actionLabel,data:function(data){return data},sortable:false,searchable:false}})
        }
        dd = Object.assign({no:{label:'No.',sortable:false,searchable:false,data:function(data){return data},render: function (data, type, row, meta) { return meta.row + meta.settings._iDisplayStart + 1}}},dd)
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
