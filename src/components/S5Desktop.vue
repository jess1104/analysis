<script setup>
import { ref, computed } from "vue";
import { useDataStore } from "@/stores/useDataStore";
const tab = ref("one");

// 使用 Pinia store
const dataStore = useDataStore();
const leagueId = computed(() => dataStore.leagueId);
const homeId = computed(() => dataStore.homeId);
const awayId = computed(() => dataStore.awayId);
const sportName = computed(() => dataStore.sportName);
const overUnderData = computed(() => dataStore.overUnder);

// 定义不同运动类型的分数选项
const scores = {
  Basketball: ["125.5", "145.5", "165.5", "185.5", "200.5", "225.5"],
  Soccer: ["0.5", "1.5", "2.5", "3.5", "4.5", "5.5"],
  Baseball: ["6.5", "7.5", "8.5", "9.5", "10.5"],
};

// 根据传入的运动类型获取对应的分数选项
const scoreOptions = computed(() => scores[sportName.value] || []);
const option = ref(scoreOptions.value[2]);

// 當 v-combobox 的值改變時調用 fetchOverUnder 方法
const handleComboboxChange = (value) => {
  const index = scoreOptions.value.indexOf(value);
  if (index !== -1) {
    dataStore.fetchOverUnder(leagueId.value, homeId.value, awayId.value, index);
  }
};
</script>

<template>
  <section class="s5">
    <div class="s5-title">高於/低於</div>
    <template></template>
    <v-card v-if="false">
      <v-tabs v-model="tab">
        <v-tab value="one">Item One</v-tab>
        <v-tab value="two">Item Two</v-tab>
        <v-tab value="three">Item Three</v-tab>
      </v-tabs>
      <v-card-text>
        <v-tabs-window v-model="tab">
          <v-tabs-window-item value="one"> One </v-tabs-window-item>

          <v-tabs-window-item value="two"> Two </v-tabs-window-item>

          <v-tabs-window-item value="three"> Three </v-tabs-window-item>
        </v-tabs-window>
      </v-card-text>
    </v-card>
    <div class="white-contain"></div>
    <div class="title d-flex justify-space-around">
      <div class="team">球隊</div>
      <div v-if="$vuetify.display.width > 1024" class="done">已賽</div>
      <!-- <div class="over">高於</div> -->
      <div class="over-under d-flex justify-space-between">
        <div class="over">高於</div>
        <div class="under">低於</div>
      </div>
      <!-- <div class="under">低於</div> -->
      <div v-if="$vuetify.display.width > 1024" class="avg-points">平均得分</div>
    </div>
    <div class="content d-flex justify-space-around py-3">
      <div class="team">{{ overUnderData.participant1.name }}</div>
      <div v-if="$vuetify.display.width > 1024" class="done">{{ overUnderData.participant1.total_matches }}</div>
      <div class="over-under d-flex">
        <div class="over">{{ overUnderData.participant1.over }}</div>
        <div class="participant1-rate">{{ overUnderData.participant1.over_rate }}</div>
        <div class="progress">
          <div class="progress-left" :style="{ width: overUnderData.participant1.over_rate }"></div>
        </div>
        <div class="participant2-rate">{{ overUnderData.participant1.under_rate }}</div>
        <div class="under">{{ overUnderData.participant1.under }}</div>
      </div>
      <div v-if="$vuetify.display.width > 1024" class="avg-points">{{ overUnderData.participant1.avg_points }}</div>
    </div>
    <div class="content d-flex justify-space-around py-3">
      <div class="team">{{ overUnderData.participant2.name }}</div>
      <div v-if="$vuetify.display.width > 1024" class="done">{{ overUnderData.participant2.total_matches }}</div>
      <div class="over-under d-flex">
        <div class="over">{{ overUnderData.participant2.over }}</div>
        <div class="participant1-rate">{{ overUnderData.participant2.over_rate }}</div>
        <div class="progress">
          <div class="progress-left" :style="{ width: overUnderData.participant2.over_rate }"></div>
        </div>
        <div class="participant2-rate">{{ overUnderData.participant2.under_rate }}</div>
        <div class="under">{{ overUnderData.participant2.under }}</div>
      </div>
      <div v-if="$vuetify.display.width > 1024" class="avg-points">{{ overUnderData.participant2.avg_points }}</div>
    </div>
    <div class="white-contain"></div>
    <div class="chose-contain my-3">
      <v-select v-model="option" :items="scoreOptions" @update:modelValue="handleComboboxChange" variant="outlined" density="compact"></v-select>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.s5 {
  position: relative;
  width: 100%;
  display: flex;
  flex-direction: column; /* 如果有多个子元素可以垂直排列 */
  margin-top: 20px;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
  background-color: #fff;
  &-title {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    color: #fff;
    background: $primary;
  }
  .white-contain {
    width: 100%;
    height: 50px;
  }
  .chose-contain {
    position: absolute;
    top: 28px;
    right: 10px;
    width: 200px;
    // margin-left: auto;
  }
  .title {
    color: #fff;
    background-color: $secondary;
  }
  .content {
    &:nth-child(even) {
      background-color: #f4f4f4;
    }
    .over {
      margin-right: auto;
    }
    .under {
      margin-left: auto;
    }
  }
  .team,
  .done,
  .avg-points {
    flex: 1; /* 使这些元素共享剩余空间 */
    padding: 0 10px;
    text-align: center;
  }
  .over-under {
    flex: 1 1 10%; /* 占据 50% 宽度，并允许调整 */
    text-align: center;
    // padding: 0 10px;
    justify-content: center;
    .progress {
      position: relative;
      margin: 0 10px;
      width: 100px;
      height: 30px;
      background-color: $right-color;
      &-left {
        position: absolute;
        width: 34%;
        height: 100%;
        background-color: $left-color;
      }
    }
  }
}
@media (max-width: 1024px) {
  .s5 {
    .over-under {
      flex: 1 1 30%;
      padding-right: 10px;
      .progress {
        width: 60px;
      }
    }
    div.team {
      width: 30%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}
</style>
