// src/store/useDataStore.js
import { defineStore } from "pinia";
// import { useRouter } from "vue-router";
import axios from "axios";

// const eventID = 1528;
// const team1ID = 136228;
// const team2ID = 136261;

const scores = {
  Basketball: ["125.5", "145.5", "165.5", "185.5", "200.5", "225.5"],
  Soccer: ["0.5", "1.5", "2.5", "3.5", "4.5", "5.5"],
  Baseball: ["6.5", "7.5", "8.5", "9.5", "10.5"],
};

const domain = import.meta.env.VITE_API_DOMAIN ;

export const useDataStore = defineStore("dataStore", {
  state: () => ({
    isLoading: true,
    leagueId: 1528,
    homeId: 136228,
    awayId: 136261,
    sportName: "soccer",
    leagueName: "測試聯盟",
    homeName: "測試隊伍1",
    awayName: "測試隊伍2",
    startTime: "08-15 16:00",
    posts: [],
    matchVictory: {},
    maxWin: {}, // 最高獲勝
    totalAvg: {}, // 總得分/平均得分
    ranks: {}, // 排名
    historyWin: {}, // 中間圈圈已賽
    matchHistory: {}, // 歷史對戰
    matchTeamHis: {}, // 單隊歷史對戰
    matchFuture: {}, // 單隊未來對戰
    overUnder: {}, // 大小分
  }),
  actions: {
    // async fetchPosts() {
    //   try {
    //     const response = await axios.get("https://jsonplaceholder.typicode.com/posts");
    //     this.posts = response.data;
    //   } catch (error) {
    //     console.error("Failed to fetch data", error);
    //   }
    // },
    setLoading(status) {
      this.isLoading = status;
    },
    setLeagueId(id) {
      this.leagueId = id;
    },
    // 拿到聯盟名稱,球種
    async fetchLeagueName(id = 1528) {
      const response = await axios.get(`${domain}/api/v1/get_competition_name?competition_id=${id}`);
      this.leagueName = response.data.competition_name;
      this.sportName = response.data.sport_name;
    },
    // 拿到隊伍名稱
    async fetchParticipantsName(homeId = 136228, awayId = 136261) {
      const response = await axios.get(`${domain}/api/v1/get_participants_name?participant1_id=${homeId}&participant2_id=${awayId}`);
      this.homeName = response.data[homeId];
      this.awayName = response.data[awayId];
    },
    setHomeId(id) {
      this.homeId = id;
    },
    setAwayId(id) {
      this.awayId = id;
    },
    setSportName(sportName) {
      this.sportName = sportName;
    },
    setStartTime(time) {
      this.startTime = time;
    },
    // 拿到比賽勝負
    async fetchMatchVictory(team1Id, team2Id) {
      const response = await axios.get(
        `${domain}/api/v1/get_recent_matches_victory_defeat?participant1_id=${team1Id}&participant2_id=${team2Id}`
      );
      this.matchVictory = response.data;
    },
    async fetchMaxWin(team1Id, team2Id) {
      const response = await axios.get(`${domain}/api/v1/get_pair_max_win_points?participant1_id=${team1Id}&participant2_id=${team2Id}`);
      this.maxWin = response.data;
    },
    async fetchTotalAvg(leagueId, team1Id, team2Id) {
      const response = await axios.get(
        `${domain}/api/v1/get_participant_total_avg_points?competition_id=${leagueId}&participant1_id=${team1Id}&participant2_id=${team2Id}`
      );
      this.totalAvg = response.data;
    },
    async fetchRank(leagueId, team1Id, team2Id) {
      const response = await axios.get(
        `${domain}/api/v1/get_season_standings?competition_id=${leagueId}&participant1_id=${team1Id}&participant2_id=${team2Id}`
      );
      this.ranks = response.data;
    },
    async fetchHistoryWin(team1Id, team2Id) {
      const response = await axios.get(`${domain}/api/v1/get_pair_history_summation?participant1_id=${team1Id}&participant2_id=${team2Id}`);
      this.historyWin = response.data;
    },
    async fetchMatchHistory(team1Id, team2Id) {
      const response = await axios.get(`${domain}/api/v1/get_pair_finished_matches?participant1_id=${team1Id}&participant2_id=${team2Id}`);
      this.matchHistory = response.data;
    },
    async fetchMatchTeamHis(team1Id, team2Id) {
      const response = await axios.get(`${domain}/api/v1/get_finished_matches?participant1_id=${team1Id}&participant2_id=${team2Id}`);
      this.matchTeamHis = response.data;
    },
    async fetchMatchFuture(team1Id, team2Id) {
      const response = await axios.get(`${domain}/api/v1/get_future_matches?participant1_id=${team1Id}&participant2_id=${team2Id}`);
      this.matchFuture = response.data;
    },
    async fetchOverUnder(leagueId, team1Id, team2Id, index = 2) {
      await this.fetchLeagueName(leagueId);
      if (["Soccer", "Basketball", "Baseball"].indexOf(this.sportName) === -1) {
        this.sportName = "Soccer";
      }
      const response = await axios.get(
        `${domain}/api/v1/get_over_under_points?participant1_id=${team1Id}&participant2_id=${team2Id}&ou_points=${
          scores[this.sportName][index]
        }`
      );
      this.overUnder = response.data;
    },
  },
});
