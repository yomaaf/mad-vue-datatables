<template>
  <div
    id="app"
    class="col-12"
  >
    <!-- Using the MadVueDatatable component -->
    <mad-vue-datatable
      ref="table"
      :action="true"
      :column-filtering="true"
      :dtfields="dtfields"
      :table-name="'example'"
      url="/json.txt"
      @testing="doTesting"
    >
    <template slot-scope="props">
    <button
    class="btn btn-success"
    data-action="testing"
    >
    {{ props.ctx.data.name }}
    </button>
    </template>
    </mad-vue-datatable>
  </div>
</template>

<script>
import MadVueDatatable from '../src'
export default {
  name: 'App',
  components: { MadVueDatatable },
  data() {
    const vm = this
    return {
      dtfields: {
        name: { label: 'Name', sortable: true, searchable: true, defaultOrder: 'desc' },
        name2: { label: 'Name', data:'name', sortable: true, searchable: true, defaultOrder: 'desc' },
        name3: { label: 'Name', data:'name', sortable: true, searchable: true, defaultOrder: 'desc' },
        name4: { label: 'Name', data:'name', sortable: true, searchable: true, defaultOrder: 'desc' },
        name5: { label: 'Name', data:'name', sortable: true, searchable: true, defaultOrder: 'desc' },
        name6: { label: 'Name', data:'name', sortable: true, searchable: true, defaultOrder: 'desc' },
        name7: { label: 'Name', data:'name', sortable: true, searchable: true, defaultOrder: 'desc' },
        name8: { label: 'Name', data:'name', sortable: true, searchable: true, defaultOrder: 'desc' },
        name9: { label: 'Name', data:'name', sortable: true, searchable: true, defaultOrder: 'desc' }
      },
    }
  },
  methods: {
    doTesting(data){
      console.log(data)
    }
  }
}
</script>

<style scoped>
</style>
