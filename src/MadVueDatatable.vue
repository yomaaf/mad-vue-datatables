<template>
  <div
    :class="classes"
  >
    <table
      v-once
      :id="tableId"
      ref="table"
      style="width:100%;"
      :class="className"
      cellpadding="0"
    >
      <thead>
        <tr>
          <th
            v-for="(field, i) in options.columns"
            :key="i"
            :class="field.className"
          >
            <slot
              :name="'header_'+field.name"
              :field="field"
              :i="i"
            >
              <div v-html="field.title" />
            </slot>
          </th>
        </tr>
      </thead>
    </table>
  </div>
</template>

<script>
const jQuery = require('jquery')
import Vue from 'vue'
if(!window.Vue){
  window.Vue = Vue
}
if(!window.jQuery){
  window.jQuery = jQuery
  window.$ = jQuery
}
let myUniqueId = 1

import 'bootstrap/dist/css/bootstrap.min.css'
import 'datatables.net-bs4/css/dataTables.bootstrap4.min.css'
import 'datatables.net-responsive-bs4/css/responsive.bootstrap4.min.css'
import 'popper.js'
import 'bootstrap/dist/js/bootstrap'
import 'datatables.net-bs4'
import 'datatables.net-responsive'
import 'datatables.net-responsive-bs4'

export default {
  name: 'MadVueDatatable',
  props: {
    id: {
      type: String,
      default: null
    },
    containerClassName: {
      type: String,
      default: 'table-responsive d-print-inline'
    },
    className: {
      type: String,
      default: 'table table-striped table-bordered nowrap w-100'
    },
    opts: {
      type: Object
    },
    fields: {
      type: Object
    },
    dataLoader: {
      type: Function
    },
    hideFooter: {
      type: Boolean
    },
  },
  data() {
    return {
      tableId: null,
      options: {
/*eslint-disable */
        dom: "tr<'row madvue-footer'<'col-sm-12 col-md-5'i><'col-sm-12 col-md-7'pl>>",
/*eslint-enable */
        columns: [],
        language: {
          infoFiltered: ''
        },
        lengthMenu: [ [15, 100, 500, 1000, -1], [15, 100, 500, 1000, 'All'] ],
        pageLength: 15,
        buttons: []  // remove any button defaults
      },
      dataTable: null,
      madvue: this
    }
  },
  computed: {
    jq() {
      return window.jQuery
    },
    myVue() {
      return window.Vue
    },
    classes() {
      const that  = this
      let classes = `${that.containerClassName} madvue-container`
      if (this.hideFooter) {
        classes += ' hide-footer'
      }

      return classes
    }
  },
  created() {
    const that = this
    const jq   = that.jq

    that.tableId = that.id || `madvuetable${myUniqueId++}`

    // allow user to override default options
    if (that.opts) {
      that.options = jq.extend({}, that.options, that.opts)
    }
  },
  mounted() {
    const that   = this
    const jq     = that.jq
    const $el    = jq(that.$refs.table)
    const orders = []

    let startCol = 0
    let icol     = 0

    if (that.fields) {
      const fields = that.fields
      let cols     = that.options.columns

      for (let k in fields) {
        const field = fields[k]
        field.name  = field.name || k

        if (field.isLocal) {
          field.searchable = false
          field.sortable  = false
        }

        let col = {
          title:      field.label || field.name,
          data:       field.data || field.name,
          width:      field.width,
          name:       field.name,
          className:  field.className,
          index:      field.index || (icol + 1)
        }

        if (field.width) {
          col.width = field.width
        }

        if (field.hasOwnProperty('defaultContent')) {
          col.defaultContent = field.defaultContent
        }

        if (field.hasOwnProperty('sortable')) {
          col.orderable = field.sortable
        }

        if (field.hasOwnProperty('visible')) {
          col.visible = field.visible
        }

        if (field.hasOwnProperty('searchable')) {
          col.searchable = field.searchable
        }

        if (field.hasOwnProperty('editField')) {
            col.editField = field.editField
        }
        if (field.template || that.$scopedSlots[field.name]) {
          field.render = that.compileTemplate(field, that.$scopedSlots[field.name])
        }

        if (field.render) {
          if (!field.render.templated) {
            let myRender = field.render
            field.render = function() {
              return myRender.apply(that, Array.prototype.slice.call(arguments))
            }
          }

          col.render = field.render
        }

        cols.push(col)

        if (field.defaultOrder) {
          orders.push([icol, field.defaultOrder])
        }

        icol++
      }

      cols = cols.sort((a, b) => a.index - b.index)
    }

    that.options.order = that.options.order || orders

    if (startCol > 0) {
      if (that.options.order) {
        that.options.order.forEach((v) => {
          v[0] += startCol
        })
      } else {
        that.options.order = [[startCol, 'asc']]
      }
    }

    if (that.dataLoader) {
      delete that.options.ajax
      that.options.serverSide = false
    }

    that.$emit('table-creating', that, $el)

    that.dataTable = $el.DataTable(that.options)

    $el.on('click', '[data-action]', (e) => {
      e.preventDefault()
      e.stopPropagation()
      let target = jq(e.target)
      let action  = target.attr('data-action')
      while(!action) {
        if (target.hasClass('madvue-container') ||
          target.prop('tagName') === 'table') {
          return
        }
        target = target.parent()
        action = target.attr('data-action')
      }

      if (action) {
        let tr = target.closest('tr')
        if (tr) {
          if (tr.attr('role') !== 'row') {
            tr = tr.prev()
          }
          const row  = that.dataTable.row(tr)
          const data = row.data()
          that.$emit(action, data, row, tr, target)
        } else {
          that.$emit(action, null, null, null, target)
        }
      }
    })

    that.$emit('table-created', that)

    if (that.dataLoader) {
      that.reload()
    }
  },
  beforeDestroy() {
    const that = this
    if (that.dataTable) {
      that.dataTable.destroy(true)
    }

    that.dataTable = null
  },
  methods: {
    compileTemplate(field, slot) {
      const that = this
      const jq   = that.jq
      const vue  = that.myVue
      const res  = vue.compile(`<div>${field.template || ''}</div>`)


      const renderFunc = (data, type, row, meta) => {
        let myRender = res.render

        if (slot) {
          myRender = (createElement) => {
            return createElement('div', [
              slot({
                data: data,
                type: type,
                row: row,
                meta: meta,
                madvue: that,
                def: field,
                comp: that.$parent
              })
            ])
          }
        }

        const comp = new vue({
          data: {
            data: data,
            type: type,
            row: row,
            meta: meta,
            madvue: that,
            def: field,
            comp: that.$parent
          },
          render: myRender,
          staticRenderFns: res.staticRenderFns
        }).$mount()
        return jq(comp.$el).html()
      }


      renderFunc.templated = true

      return renderFunc
    },
    setTableData(data) {
      const that = this
      if (data.constructor === Array) {
        that.dataTable.clear().rows.add(data)
        that.dataTable.draw(false)
        that.dataTable.columns.adjust()
      }
      return that
    },
    reload(resetPaging = false) {
      const that = this
      if (that.dataLoader) {
        that.dataLoader((data) => {
          if (data && !data.data) {
            data = { data: data }
          }
          that.setTableData( data.data )

          that.$emit('reloaded', data, that)
        })
      } else {
        that.dataTable.ajax.reload( (data) => { that.$emit('reloaded', data, that) } , resetPaging )
      }

      return that
    },
    search(value) {
      const that = this
      that.dataTable.search( value ).draw()

      return that
    },
    setPageLength(value) {
      const that = this
      that.dataTable.page.len( value )

      return that.reload()
    },
    getServerParams() {
      if (this.dataLoader) {
        return {}
      }

      return this.dataTable.ajax.params()
    }
  }
}
</script>
<style>
.madvue-footer .dataTables_length {
  padding-top: 6px;
  padding-right: 10px;
}
.madvue-footer .dataTables_length, .madvue-footer .dataTables_paginate {
  float: right;
}
.hide-footer .madvue-footer {
  display: none;
}
</style>
