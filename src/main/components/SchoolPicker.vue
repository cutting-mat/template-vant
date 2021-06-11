<template>
  <div>
    <van-popup
      :value="visible"
      position="right"
      :style="{ width: '100%', height: '100%' }"
      @open="handleOpen()"
      @close="$emit('close')"
    >
      <div class="flex-col SchoolPicker">
        <div class="contBox" style="overflow: hidden">
          <div class="pageTitle">请选择学校</div>
          <van-field
            class="searchInput"
            clearable
            v-model.trim="queryParam.name"
            placeholder="学校名称搜索"
          >
            <template #button>
              <van-icon name="search" @click="onSearch" />
            </template>
          </van-field>
        </div>
        <div class="flex-1 scrollbar contBox">
          <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            @load="fetchData"
          >
            <van-cell
              v-for="item in list"
              :key="item.id"
              :title="item.name"
              @click="checked = (checked && (checked.id === item.id) ? null : item)"
            >
              <template #right-icon v-if="checked && checked.id === item.id">
                <van-icon name="success" class="checked_icon" />
              </template>
            </van-cell>
          </van-list>
        </div>
        <div class="actions">
          <van-button
            block
            color="linear-gradient(to right, #fa533e, #fe3d53)"
            native-type="button"
            @click="
              $emit('change', checked);
              $emit('close');
            "
          >
            确认
          </van-button>
          <van-button
            v-if="dataType == 1"
            class="plainBtn"
            block
            native-type="button"
            plain
            type="danger"
            @click="inputVisible = true"
            >没有找到学校？前往创建</van-button
          >
        </div>
      </div>
      <i
        role="button"
        class="van-icon van-icon-cross van-popup__close-icon van-popup__close-icon--top-right"
        @click="$emit('close')"
        ><!----></i
      >
    </van-popup>
    <InputEditer
      :visible="inputVisible"
      labelText="学校名称"
      @change="handleInput"
      @close="inputVisible = false"
    />
  </div>
</template>

<script>
import { store } from "@/store";
import { allSchools } from "@/main/api/common";
import { joinedSchools } from "@/main/api/apply";

export default {
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
    dataType: {
      type: String,
      required: false,
      default: "1", // 1 所有学校 2 已报名五个一的学校
    },
  },
  components: {
    InputEditer: (resolve) =>
      require(["@/team/components/InputEditer.vue"], resolve),
  },
  data() {
    return {
      state: store.state,
      loading: false,
      inputVisible: false,
      checked: null,
      queryParam: {
        pageSize: 10,
        p: 0,
        name: null,
      },
      totalCount: 0,
      totalPage: 0,
      list: [],
      finished: false,
    };
  },
  computed: {
    listApi() {
      return this.dataType === "1" ? allSchools : joinedSchools;
    },
  },
  watch: {
    listApi() {
      this.fetchData(true);
    },
  },
  methods: {
    handleOpen() {
      this.checked = null;
      this.queryParam.name = null;
      this.fetchData(true)
    },
    handleInput(value) {
      if (value && value.split) {
        this.checked = {
          name: value,
        };
        this.$emit("change", this.checked);
        this.$emit("close");
      }
    },
    onSearch() {
      this.fetchData(true);
    },
    fetchData(reload) {
      if (reload) {
        this.queryParam.p = 1;
      } else {
        this.queryParam.p++;
      }
      this.loading = true;
      this.listApi(this.queryParam)
        .then((res) => {
          this.loading = false;
          const data = res.data.data;
          if (data && data.list) {
            if (reload) {
              this.list = data.list;
              // 搜索结果为空提示
              if(this.queryParam.name && (data.list.length===0)){
                this.$dialog.alert({
                  title: '没有找到相关学校',
                  message: `可能是以下原因\n1. 请确认输入的学校名称或关键词是否准确；\n2. 你所查找的学校可能尚未加入思政教学联盟，或尚未参与本次大赛，请先以学校名义报名。`,
                  messageAlign: 'left'
                });
              }
            } else {
              data.list.forEach((item) => {
                this.list.push(item);
              });
            }

            this.totalCount = data.totalCount;
            this.totalPage = data.totalPage;
            
            this.finished = !(this.totalCount > this.list.length);
          } else {
            console.warn("接口数据异常");
            this.finished = true;
          }
        })
        .catch(() => {
          this.loading = false;
          this.finished = true;
        });
    },
  },
};
</script>

<style scoped>
.SchoolPicker {
  background: #f2f5f9;
  height: 100%;
  box-sizing: border-box;
  padding: 1em;
}
/* 搜索 */
.searchInput {
  border: 1px solid #dedede;
  border-radius: 30px;
  padding: 0 12px;
  margin: 12px;
  width: auto;
}
.searchInput >>> .van-icon-search {
  font-size: 20px;
  margin-top: 4px;
  color: #b9b9b9;
}

.pageTitle {
  font-size: 1.1em;
  padding: 1em 1em 0;
}
.contBox {
  background: #fff;
  border-radius: 6px;
  margin-bottom: 1em;
}
.actions {
  padding: 0.5em 0;
}
.actions .van-button {
  margin-top: 0.5em;
}
.checked_icon {
  font-size: 1.5em;
  color: #fe3d53;
}

.plainBtn{
  color: #FE664E;
  border-color: #FE664E;
  background: #fcefef;
}
</style>
