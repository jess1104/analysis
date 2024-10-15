<script setup>
import { ref, reactive, watch, defineProps, computed } from "vue";
import { useDataStore } from "@/stores/useDataStore";
const store = useDataStore();

// 是否打開更多
const isOpen = reactive({
  rescentHome: false,
  rescentAway: false,
});

const homeName = computed(() => store.homeName);
const awayName = computed(() => store.awayName);

// ref of div收合toTop
const homeRecentContainer = ref(null);
const awayRecentContainer = ref(null);

// props進來的隊伍名稱
const { matchData, isRecent } = defineProps({
  matchData: {
    type: Object,
    required: true,
  },
  isRecent: {
    type: Boolean,
    default: false,
  },
});

// 歷史賽事資料
// const matchTeamHis = computed(() => store.matchTeamHis);
const tab = ref(matchData.participant1[0]?.participant_id);

// 监听 isOpen.rescentHome,recentAway 的变化
watch(
  () => isOpen.rescentHome,
  (newVal) => {
    if (!newVal && homeRecentContainer.value) {
      // 程序化滚动到顶部
      homeRecentContainer.value.scrollTop = 0;
    }
  }
);
watch(
  () => isOpen.rescentAway,
  (newVal) => {
    if (!newVal && awayRecentContainer.value) {
      // 程序化滚动到顶部
      awayRecentContainer.value.scrollTop = 0;
    }
  }
);

// 加時/完賽簡化
function formatStatusName(name) {
  const match = name.match(/overtime/);
  if (match) {
    // console.log("match", match); // "overtime"
    return match[0];
  } else {
    return name;
  }
}
</script>
<template>
  <section class="s4-mobile">
    <div class="s4-history title">{{ isRecent ? "最近賽事" : "未來賽事" }}</div>
    <template v-if="matchData.participant1.length">
      <v-tabs v-model="tab" align-tabs="center" color="#5c9af8" grow>
        <v-tab :value="matchData.participant1[0]?.participant_id">{{ homeName }}</v-tab>
        <v-tab :value="matchData.participant2[0]?.participant_id">{{ awayName }}</v-tab>
      </v-tabs>
      <v-tabs-window v-model="tab">
        <!-- <v-tabs-window-item value="Landscape"> ggg </v-tabs-window-item> -->
        <v-tabs-window-item :value="matchData.participant1[0]?.participant_id">
          <div class="s4-home">
            <div class="s4-race-title d-flex justify-space-between align-center">
              <div class="match-event pl-2">賽事</div>
              <div class="match-content">比賽</div>
            </div>
            <div class="s4-events-contain" :class="{ expansion: isOpen.rescentHome }" ref="homeRecentContainer">
              <div v-for="event in matchData.participant1" :key="event.start_date" class="s4-event d-flex justify-space-between align-center">
                <div class="match-league px-2">
                  {{ event.competition_name }}
                </div>
                <div class="match-info d-flex justify-space-between align-center">
                  <div class="match-info_home px-1" :class="{ win: event.participant1_value > event.participant2_value }">
                    {{ event.participant1_name }}
                  </div>
                  <div class="match-info_mid">
                    <div class="time">{{ event.start_date }}</div>
                    <div v-if="isRecent" class="score">
                      <span :class="{ win: event.participant1_value > event.participant2_value }">{{ event.participant1_value }}</span>
                      <span>:</span>
                      <span :class="{ win: event.participant2_value > event.participant1_value }">{{ event.participant2_value }}</span>
                      <span>({{ formatStatusName(event.status_name) }})</span>
                    </div>
                  </div>
                  <div class="match-info_away px-1" :class="{ win: event.participant2_value > event.participant1_value }">
                    {{ event.participant2_name }}
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-more d-flex justify-center">
              <v-btn class="my-2" variant="elevated" color="primary" @click="isOpen.rescentHome = !isOpen.rescentHome">{{ isOpen.rescentHome ? "顯示更少" : "顯示更多" }}</v-btn>
            </div>
          </div>
        </v-tabs-window-item>
        <v-tabs-window-item :value="matchData.participant2[0]?.participant_id">
          <div class="s4-away">
            <div class="s4-race-title d-flex justify-space-between align-center">
              <div class="match-event pl-2">賽事</div>
              <div class="match-content">比賽</div>
            </div>
            <div class="s4-events-contain" :class="{ expansion: isOpen.rescentAway }" ref="awayRecentContainer">
              <div v-for="event in matchData.participant2" :key="event.start_date" class="s4-event d-flex justify-space-between align-center">
                <div class="match-league px-2">{{ event.competition_name }}</div>
                <div class="match-info d-flex justify-space-between align-center">
                  <div class="match-info_home px-1" :class="{ win: event.participant1_value > event.participant2_value }">
                    {{ event.participant1_name }}
                  </div>
                  <div class="match-info_mid">
                    <div class="time">{{ event.start_date }}</div>
                    <div v-if="isRecent" class="score">
                      <span :class="{ win: event.participant1_value > event.participant2_value }">{{ event.participant1_value }}</span>
                      <span>:</span>
                      <span :class="{ win: event.participant2_value > event.participant1_value }">{{ event.participant2_value }}</span>
                      <span>({{ formatStatusName(event.status_name) }})</span>
                    </div>
                  </div>
                  <div class="match-info_away px-1" :class="{ win: event.participant2_value > event.participant1_value }">
                    {{ event.participant2_name }}
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-more d-flex justify-center">
              <v-btn class="my-2" variant="elevated" color="primary" @click="isOpen.rescentAway = !isOpen.rescentAway">{{ isOpen.rescentAway ? "顯示更少" : "顯示更多" }}</v-btn>
            </div>
          </div>
        </v-tabs-window-item>
      </v-tabs-window>
    </template>
    <template v-else>
      <div class="no-data pa-2">目前尚無賽事</div>
    </template>
  </section>
</template>

<style lang="scss" scoped>
.s4 {
  &-mobile {
    margin-top: 20px;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    background-color: #fff;
    font-size: 14px;
    :deep(.v-tab) {
      max-width: 49vw;
      .v-btn__content {
        white-space: inherit;
      }
    }
    :deep(.v-btn--size-default) {
      padding: 0;
    }
    .match-league,
    .match-event {
      width: 24vw;
      text-align: center; /* 水平置中 */
    }
  }
  &-history {
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-weight: 800;
    color: #fff;
    background: $primary;
  }
  &-home,
  &-away {
    // width: calc(50vw - 22px);
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    height: fit-content;
    .match-content {
      text-align: center;
      width: 76vw;
    }
    .s4-race-title,
    .s5-race-title {
      height: 36px;
      background: $secondary;
      color: #fff;
    }
  }
  &-events-contain {
    max-height: 425px;
    overflow-y: hidden;
    border-bottom: 2px solid #f4f4f4;
    font-size:12px;
    &.expansion {
      max-height: 600px;
      overflow-y: scroll;
    }
    .match-league {
      // line-height: 75px; /* 行高設置為與高度相同 */
      text-align: center; /* 水平置中 */
    }
    .match-info {
      width: 76vw;
      flex-direction: column;
      > * {
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        white-space: nowrap;
        text-align: center;
      }
      .win {
        color: $primary;
        font-weight: 500;
      }
      &_mid > * {
        padding-left: 8px;
        display: inline;
      }
    }
    .match-info > div {
      flex: 1;
    }
    .s4-event,
    .s5-event {
      height: 85px;
      &:nth-child(even) {
        background-color: #f4f4f4;
      }
    }
  }
}
.no-data {
  text-align: center;
}
</style>
