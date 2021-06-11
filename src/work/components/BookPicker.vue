<template>
  <div>
    <van-popup
      :value="visible"
      position="right"
      :style="{ width: '100%', height: '100%' }"
      @open="handleOpen()"
      @close="$emit('close')"
    >
      <div class="flex-col BookPicker">
        <div class="_hd" style="overflow: hidden">
          <div class="pageTitle">选择书籍或文献</div>
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
              @click="checked = checked && checked.id === item.id ? null : item"
            >
              <div class="flex-row align-center">
                <div class="book_avatar">
                  <img v-if="item.cover" :src="item.cover" />
                </div>
                <div class="flex-1 el" style="margin:0 .5em">
                  {{ item.name }}
                </div>
                <van-icon
                  v-if="checked && checked.id === item.id"
                  name="success"
                  class="checked_icon"
                />
              </div>
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
            class="plainBtn"
            block
            native-type="button"
            plain
            type="danger"
            @click="inputVisible = true"
            >有其他想研读的书籍或文献？前往录入</van-button
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
    <BookEditer
      :visible="inputVisible"
      @change="handleAdd"
      @close="inputVisible = false"
    />
  </div>
</template>

<script>
import { store } from "@/store";
import * as api from "../api/book";

export default {
  props: {
    visible: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  components: {
    BookEditer: (resolve) =>
      require(["../components/BookEditer.vue"], resolve),
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
  methods: {
    handleOpen() {
      this.checked = null;
      this.queryParam.name = null;
      this.fetchData(true);
    },
    handleAdd(item) {
      if (item && item.name) {
        this.checked = item;

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
      api
        .list(this.queryParam)
        .then((res) => {
          this.loading = false;
          const data = res.data.data;
          if (data && data.list) {
            if (reload) {
              this.list = data.list;
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
.BookPicker {
  background: #f2f5f9;
  height: 100%;
  box-sizing: border-box;
  padding: 1em;
}
.BookPicker ._hd {
  margin-bottom: 1em;
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
.book_avatar{
  width: 3em;
  height: 4em;
  background:url('../assets/img/book.png') center center no-repeat;
  background-size: cover;
}
.book_avatar img{
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.plainBtn {
  color: #fe664e;
  border-color: #fe664e;
  background: #fcefef;
}
</style>
