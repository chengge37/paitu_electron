<template>
  <div>
    <el-row>
      <AnalysisHead
        :type="2"
        @selectTab="selectTab"
        @handleFresh="handleFresh"
        @selectTime="selectTime"
        @selectTimeRange="selectTimeRange"
        @clickPurpleBtn="clickPurpleBtn"
        @clickSearch="clickSearch"
        @clickAttr="clickAttr"
      ></AnalysisHead>
    </el-row>
    <el-row>
      <el-table :data="tableData" stripe style="width: 100%" border >
        <el-table-column prop="studioType" label="影棚类型"></el-table-column>
        <el-table-column prop="name" label="名称"></el-table-column>
        <el-table-column label="面积" width="80">
          <template slot-scope="scope">
            <span>{{scope.row.area}}m<sup>2</sup></span>
          </template>
        </el-table-column>
        <el-table-column label="影棚器材概况"  width="700">
          <template slot-scope="scope">
            <el-table :data="scope.row.detail" height="250">
              <el-table-column prop="camera_name" label="器材名称"></el-table-column>
              <el-table-column prop="type" label="情况"></el-table-column>
              <el-table-column prop="rent_count" label="租借次数"></el-table-column>
              <el-table-column prop="closed_rate" label="成交率"></el-table-column>
              <el-table-column prop="sales_volume" label="销售额"></el-table-column>
              <el-table-column prop="rent_total_hour" label="租借时长"></el-table-column>
              <el-table-column prop="rent_rate" label="租借率"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="指标" width="160">
          <template slot-scope="scope">
            <el-table :data="scope.row.quota" :show-header="false" fit>
              <el-table-column prop="opt"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
        <el-table-column label="总计" width="160">
          <template slot-scope="scope">
            <el-table :data="scope.row.total" :show-header="false" fit>
              <el-table-column prop="opt"></el-table-column>
            </el-table>
          </template>
        </el-table-column>
      </el-table>

      <!-- 页码 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="param.page"
      :page-sizes="[10, 20, 30, 40]"
      :page-size.sync="param.page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="totalCount"
    ></el-pagination>      

    </el-row>
  </div>
</template>
<script>
import AnalysisHead from "../../components/AnalysisHead/index";
import { mapGetters } from "vuex";
export default {
  computed: {
    ...mapGetters(["user_data"])
  },
  data() {
    return {
      tableData:[
        {
          studioType:"白棚",
          name:"羽泉摄影框",
          area:"400",
          detail:[
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
          ],
          quota:[
            {opt:"租借次数"},
            {opt:"成交率"},
            {opt:"销售额"},
            {opt:"租借时长"},
            {opt:"租借率"},
        ],
          total:[
            {opt:123},
            {opt:"95%"},
            {opt:"7545元"},
            {opt:"231小时"},
            {opt:"12%"},
          ]
        },
        {
          studioType:"白棚",
          name:"羽泉摄影框",
          area:"400",
          detail:[
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
          ],
          quota:[
            {opt:"租借次数"},
            {opt:"成交率"},
            {opt:"销售额"},
            {opt:"租借时长"},
            {opt:"租借率"},
        ],
          total:[
            {opt:123},
            {opt:"95%"},
            {opt:"7545元"},
            {opt:"231小时"},
            {opt:"12%"},
          ]
        },
        {
          studioType:"白棚",
          name:"羽泉摄影框",
          area:"400",
          detail:[
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
            {
              camera_name:"佳能单反相机",
              type:"影棚自带",
              rent_count:12,
              closed_rate:"100%",
              sales_volume:"521元",
              rent_total_hour:"231小时",
              rent_rate:"100%",
            },
          ],
          quota:[
            {opt:"租借次数"},
            {opt:"成交率"},
            {opt:"销售额"},
            {opt:"租借时长"},
            {opt:"租借率"},
        ],
          total:[
            {opt:123},
            {opt:"95%"},
            {opt:"7545元"},
            {opt:"231小时"},
            {opt:"12%"},
          ]
        },
      ]
    };
  },
  methods: {
    // 选择器材或者影棚
    selectTab() {
    },
    // 刷新
    handleFresh() {
    },
    // 点击昨日今日上周...
    selectTime() {
    },
    // 选择日期范围
    selectTimeRange() {
    },
    // 查看列表
    clickPurpleBtn() {
    },
    // 查找
    clickSearch() {
    },
    // 点击租借次数，成交
    clickAttr() {
    }
  },
  components: {
    AnalysisHead
  }
};
</script>
<style lang="scss">
/deep/.el-table td{
  padding: 0;
}
</style>