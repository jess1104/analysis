<script setup>
import { ref, reactive, defineProps, watch } from "vue";

// 是否打開更多
const isOpen = reactive({
  rescentHome: false,
  rescentAway: false,
});

// ref of div收合toTop
const homeRecentContainer = ref(null);
const awayRecentContainer = ref(null);

// 加時/完賽簡化
function formatStatusName(name) {
  const match = name.match(/overtime/);
  if (match) {
    // console.log("match", match); // "overtime"
    return match[0];
  }else if(name === 'Finished after extra inning') {
    return 'overtime';
  } else {
    return name;
  }
}

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
</script>

<template>
  <!-- <div>{{ matchData }}</div> -->
  <section class="s4">
    <div class="s4-history title">{{ isRecent ? "最近賽事" : "未來賽事" }}</div>
    <div class="s4-contain d-flex justify-space-between">
      <div v-if="matchData.participant1.length" class="s4-home">
        <div class="s4-race-title d-flex justify-space-between align-center">
          <div class="match-event pl-2">賽事</div>
          <div class="match-content">比賽</div>
        </div>
        <div class="s4-events-contain" :class="{ expansion: isOpen.rescentHome }" ref="homeRecentContainer">
          <div v-for="event in matchData.participant1" :key="event.start_date" class="s4-event d-flex justify-space-between">
            <div class="match-league px-2">{{ event.competition_name }}</div>
            <div class="match-info d-flex justify-space-between align-center">
              <div class="match-info_home px-2" :class="{ win: event.participant1_value > event.participant2_value }">
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
              <div class="match-info_away px-2" :class="{ win: event.participant2_value > event.participant1_value }">
                {{ event.participant2_name }}
              </div>
            </div>
          </div>
        </div>
        <div class="btn-more d-flex justify-center">
          <v-btn class="my-2" variant="elevated" color="primary" @click="isOpen.rescentHome = !isOpen.rescentHome">{{
            isOpen.rescentHome ? "顯示更少" : "顯示更多"
          }}</v-btn>
        </div>
      </div>
      <div v-else class="s4-home pa-2 d-flex justify-center">目前尚無賽事</div>
      <div v-if="matchData.participant2.length" class="s4-away">
        <div class="s4-race-title d-flex justify-space-between align-center">
          <div class="match-event pl-2">賽事</div>
          <div class="match-content">比賽</div>
        </div>
        <div class="s4-events-contain" :class="{ expansion: isOpen.rescentAway }" ref="awayRecentContainer">
          <div v-for="event in matchData.participant2" :key="event.start_date" class="s4-event d-flex justify-space-between">
            <div class="match-league px-2">
              {{ event.competition_name }}
            </div>
            <div class="match-info d-flex justify-space-between align-center">
              <div class="match-info_home px-2" :class="{ win: event.participant1_value > event.participant2_value }">
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
              <div class="match-info_away px-2" :class="{ win: event.participant2_value > event.participant1_value }">
                {{ event.participant2_name }}
              </div>
            </div>
          </div>
        </div>
        <div class="btn-more d-flex justify-center">
          <v-btn class="my-2 more" variant="elevated" color="primary" @click="isOpen.rescentAway = !isOpen.rescentAway">{{
            isOpen.rescentAway ? "顯示更少" : "顯示更多"
          }}</v-btn>
        </div>
      </div>
      <div v-else class="s4-home pa-2 d-flex justify-center">目前尚無賽事</div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.s4 {
  margin-top: 20px;
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
    width: calc(50vw - 22px);
    background: #fff;
    box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
    height: fit-content;
    .match-content {
      text-align: center;
      width: 40vw;
    }
    .s4-race-title,
    .s5-race-title {
      height: 36px;
      background: $secondary;
    }
  }
  &-race-title {
    color: #fff;
    height: 100%;
  }
  &-events-contain {
    background: #fff;
    max-height: 375px;
    overflow: hidden;
    border-bottom: 2px solid #f4f4f4;
    &.expansion {
      max-height: 600px;
      overflow-y: scroll;
    }
    .win {
      color: $primary;
      font-weight: 700;
    }
    .match-league {
      line-height: 75px; /* 行高設置為與高度相同 */
      text-align: center; /* 水平置中 */
    }
    .match-info {
      width: 40vw;
      &_home {
        text-align: right;
      }
      &_mid {
        text-align: center;
      }
    }
    .match-info > div {
      // text-align: center;
      flex: 1;
    }
    .s4-event,
    .s5-event {
      height: 75px;
      &:nth-child(even) {
        background-color: #f4f4f4;
      }
    }
  }
}
.no-data {
  text-align: center;
  background: #fff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2);
}
</style>
