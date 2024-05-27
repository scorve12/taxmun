//-----------------------------------------------------------------------
// 기  능 : 계산기
// 작성자 : 이승환
//-----------------------------------------------------------------------
// 요율
var GLOBAL_VALUE = (function () {
    var EI_UN_WORKER = 0.009; // 고용보험 실업급여 근로자
    var EI_150L_OWNER = 0.0025; // 고용보험 150미만 사업주
    var EI_150H_OWNER = 0.0045; // 고용보험 150이상 사업주
    var EI_1000L_OWNER = 0.0065; // 고용보험 1000미만 사업주
    var EI_1000H_OWNER = 0.0085; // 고용보험 1000이상 사업주
  
    var NATIONAL_PENSION_RATE = 0.045;  // 국민연금: 전체: 9%, 근로자: 4.5%, 사업주: 4.5%
    var HEALTH_INSURE_RATE = 0.03545; // 건강보험: 전체: 7.09%, 근로자: 3.545%, 사업주: 3.545%
  
    var HEALTH_INSURE_CARE_RATE = 0.1295;  // 장기요양(건강보험): 전체: 12.95%, 근로자, 사업주: 각각 50%
    return {
      EI_UN_WORKER, EI_150L_OWNER, EI_150H_OWNER, EI_1000L_OWNER, EI_1000H_OWNER, 
      NATIONAL_PENSION_RATE, HEALTH_INSURE_RATE, HEALTH_INSURE_CARE_RATE
    }
  }());
  
  var calculate = {
    /**
     * 주휴수당 계산
     * @param hour      시간
     * @param minute    분
     * @param wage      시급
     */
    weekly: function (hour, minute, wage) {
      // console.log("hour: ", hour , ", min: ", minute, ",wage: " , wage);
      var setHour = hour;
      var setMinute = minute;
      var setWage = wage;
  
      var division = setMinute / 60;
      division = division.toFixed(2);
      // console.log("division: ", division);
  
      var weekJobTime = setHour + parseFloat(division);
      // console.log("setHour + parseFloat(division): ", setHour + parseFloat(division));
      // console.log("weekJobTime: ", weekJobTime);
  
      var weekRestPrice = 0;
      var calNum = 0;
  
      if (wage > 1000) {
        if (weekJobTime >= 15) {
          if (weekJobTime >= 40) {
            // 40시간 이상일 경우 : 8시간 * 시급
            weekRestPrice = 8 * setWage;
          } else {
            // (1주 소정근로시간/40) * 8시간 * 시급
            weekRestPrice = (weekJobTime / 40) * 8 * setWage;
          }
        }
        // console.log("result: ", weekRestPrice);
  
        // 정규식으로 1000단위 콤마(,) 구분자 추가
        calNum = util.commaNum(Math.round(weekRestPrice));
      }
      return calNum;
    },
    /**
     * 연차계산(입사일 기준) 계산
     * @param entryDt   입사일
     * @param calcDt    기준일자
     */
    annual: function (entryDt, calcDt) {
      var setEntryDt = entryDt;
      var setCalcDt = calcDt;
  
      // 입사일자와 기준일자를 GMT/UTC 변환형식으로 변환한다.
      var startDt = new Date(setEntryDt);
      var endDt = new Date(setCalcDt);
  
      // 년(입사일) - 년(기준일자)
      var diffYears = endDt.getFullYear() - startDt.getFullYear();
      // 월(입사일) - 월(기준일자)
      var diffMonths = endDt.getMonth() - startDt.getMonth();
      // 일(입사일) - 일(기준일자)
      var diffDates = endDt.getDate() - startDt.getDate();
  
      // 근로자의 근속 개월수
      // (년(입사일자,기준일자) * 12 + 월(입사일자,기준일자) + 일(입사일자,기준일자))
      var diffMonth = diffYears * 12 + diffMonths + (diffDates >= 0 ? 0 : -1);
  
      // 근속연수에 따른 연차일수
      var annualVacation = [
        "11",
        "15",
        "15",
        "16",
        "16",
        "17",
        "17",
        "18",
        "18",
        "19",
        "19",
        "20",
        "20",
        "21",
        "21",
        "22",
        "22",
        "23",
        "23",
        "24",
        "24",
        "25",
      ];
  
      var arrAnnual = [];
  
      // 1년 이상 근무자
      if (diffMonth >= 12) {
        // 근속년수(근속개월/12)
        var year = Math.floor(diffMonth / 12);
        arrAnnual[0] = year;
  
        // 발생연차(근속년수 값을 불러다가 해당 연차일수 배열을 불러온다.)
        var vacation = annualVacation[year];
  
        if (year > 21) {
          // 연차일수는 25일 까지이며, 21년 이후 부터 계속 25일이다.
          arrAnnual[1] = 25;
        } else {
          arrAnnual[1] = vacation;
        }
      } else {
        // 1년 미만 근무자(갓 신입생)
        arrAnnual[1] = diffMonth;
        arrAnnual[0] = 0;
      }
  
      return arrAnnual;
    },
    /**
     * 시급계산
     * @param hear          시급
     * @param dayworktime   일일근무시간
     * @param monthworkday  한달근무일수
     * @param tranningset   수습적용(0 or 1)
     * @param taxtypeval    세금구분(9.13% = 0.0913 or 3.3% = 0.033)
     */
    wage: function (hear, dayworktime, monthworkday, tranningset, taxtypeval) {
      var arrWage = [];
      var setHear = hear;
      var setDayworktime = dayworktime;
      var setMonthworkday = monthworkday;
      var totalDateSum = setHear * setDayworktime * setMonthworkday; // 시급 * 근무시간(일일근무시간 * 한달 근무일수)
      var workingHours = setDayworktime * 30;
  
      // 입력시급
      arrWage[0] = util.commaNum(setHear);
  
      var isTaxSet = taxtypeval;
      var isTranningSet = tranningset;
  
      // 세금 적용
      if (isTaxSet != 0) {
        // 근무시간(일일근무시간 * 한달 근무일수) * 세금
        var minusmoney = totalDateSum * isTaxSet;
  
        var resultmoney = totalDateSum - minusmoney;
        resultmoney = Math.round(resultmoney);
      } else {
        // 세금 미적용
        resultmoney = totalDateSum;
      }
  
      if (isTranningSet == 0) {
        // 수습 적용
        // 수습적용 예상수령액 10% 차감
        resultmoney = resultmoney - resultmoney * 0.1;
        resultmoney = Math.round(resultmoney);
      }
  
      // console.log("일일 : " + setDayworktime);
      // console.log("한달 : " + setMonthworkday);
  
      // 근무시간
      arrWage[1] = setDayworktime * setMonthworkday;
  
      // 실수령액
      arrWage[2] = util.commaNum(resultmoney);
  
      return arrWage;
    },
    /**
     * 퇴직금 계산
     * @param entryDt   입사일자
     * @param calcDt    퇴사일자
     * @param yearly    연간상여금
     * @param annual    연차수당
     */
    retirement: function (entryDt, calcDt, yearly, annual) {
      var arrRetirement = [];
  
      // ================= 퇴직금(일수, 일자) 계산 ================= //
      // 입사일자
      var setStart = entryDt;
      // 퇴사일자
      var setEnd = calcDt;
      // 연간상여
      var setYearly = yearly;
      // 연차수당
      var setAnnual = annual;
  
      // 입사일자와 퇴사일자를 GMT/UTC 변환형식으로 변환한다.
      var startDt = new Date(setStart);
      var endDt = new Date(setEnd);
  
      //오늘날짜와 특정 날짜의 차를 구한다
      var termDays = Math.ceil((endDt - startDt) / 1000 / 60 / 60 / 24);
      // console.log("재직일수 : " + termDays + "일\n\n");
      arrRetirement[14] = termDays; // 재직일수
  
      // 퇴사(년,월,일)
      var endYear = setEnd.substring(0, 4);
      var endMon = setEnd.substring(5, 7);
      var endDay = setEnd.substring(8, 10);
  
      // 초기화
      var yy; // 년
      var mm; // 월
      var dd; // 일
      var ddEnd; // 마지막 일
      var countDay = 0; // 기간일수
      var frontDate; // 시작일자
      var rearDate; // 종료일자
      var sumDate = 0; // 해당 일자의 합계
  
      if (new Function("return " + endDay + "-1")() == 0) {
        // 1일과 같은 첫째날 이라면...
        endMon = endMon - 1;
        idx = 3;
      } else if (new Function("return " + endDay + "-1")() > 0) {
        // 30일, 31일과 같은 말일 이라면...
        idx = 4;
      }
      // 5.29, 5.30, 5.31 일 경우 2월 계산을 하지 않키위해서. 윤년일때는 5.29일 허용
      if (
        (endMon + endDay == "529" && !util.isLeafYear(endYear)) ||
        endMon + endDay == "530" ||
        endMon + endDay == "531"
      ) {
        idx = 3;
      }
  
      var j = 4;
      var k = 8;
      // 퇴직전 3개월 일자 계산
      for (i = 1; i < idx + 1; i++) {
        j++;
        k++;
        // 년,월
        if (new Function("return " + endMon + "-" + idx + "+" + i)() <= 0) {
          yy = new Function("return " + endYear + "-1")();
          mm = 12 + new Function("return " + endMon + "-" + idx + "+" + i)();
        } else {
          yy = endYear;
          mm = new Function("return " + endMon + "-" + idx)() + i;
        }
        // 일
        if (idx == 3) {
          // 30일, 31일과 같은 말일 이라면...
          if (
            ((endMon + endDay == "529" && !util.isLeafYear(endYear)) ||
              endMon + endDay == "530" ||
              endMon + endDay == "531") &&
            i == 3
          ) {
            dd = 1;
            ddEnd = new Function("return " + endDay + "-1")();
          } else {
            dd = 1;
            ddEnd = util.MaxdayYearMonth(yy, mm);
          }
        } else if (idx == 4) {
          // 1일과 같은 첫째날 이라면...
          if (i == 1) {
            if (
              new Function("return " + endDay)() >
              new Function("return " + util.MaxdayYearMonth(yy, mm))()
            ) {
              dd =
                util.MaxdayYearMonth(yy, mm) -
                new Function(
                  "return " + util.MaxdayYearMonth(endYear, endMon) + "-" + endDay
                )();
            } else {
              dd = new Function("return " + endDay)();
            }
            ddEnd = util.MaxdayYearMonth(yy, mm);
          } else if (i == 2 || i == 3) {
            dd = 1;
            ddEnd = util.MaxdayYearMonth(yy, mm);
          } else if (i == 4) {
            dd = 1;
            ddEnd = new Function("return " + endDay + "-1")();
          }
        }
  
        // 시작일자
        frontDate = yy + "." + mm + "." + dd;
  
        arrRetirement[i] = frontDate; // 시작일자
  
        if (ddEnd != 0 && dd != ddEnd) {
          // 종료일자
          rearDate = yy + "." + mm + "." + ddEnd;
          arrRetirement[j] = rearDate; // 종료일자
          var s = new Date(yy, mm, dd);
          var e = new Date(yy, mm, ddEnd);
          // 기간별 일수
          countDay = Math.ceil((e - s) / 24 / 60 / 60 / 1000) + 1;
          // console.log("=> 해당 기간일수 : " + countDay + "일");
          arrRetirement[k] = countDay; // 기간일수
        } else {
          rearDate = "";
          countDay = 1;
          arrRetirement[9] = 1;
        }
  
        sumDate = new Function("return " + sumDate + "+" + countDay)();
        // console.log("=> 해당 일자합계 : " + sumDate + "일\n");
  
        arrRetirement[13] = sumDate; // 일자합계
      }
      // ================= 퇴직금(일수, 일자) 계산 ================= //
  
      // ================= 퇴직금(수당, 상여) 계산 ================= //
      // TODO : 기본급, 기타수당은 form에서 넘오 온 값을 활용할것.
      // 기본급
      var basic1 = Number($("#lab12").val().replace(/,/g, "")); // 1개월
      var basic2 = Number($("#lab22").val().replace(/,/g, "")); // 2개월
      var basic3 = Number($("#lab25").val().replace(/,/g, "")); // 3개월
      var basic4 = Number($("#lab34").val().replace(/,/g, "")); // 4개월
      var total_basic = basic1 + basic2 + basic3 + basic4;
      arrRetirement[17] = util.commaNum(total_basic);
      // console.log("\n기본급 합계 : " + util.commaNum(total_basic) + "원");
      // 기타수당
      var bonus1 = Number($("#lab13").val().replace(/,/g, "")); // 1개월
      var bonus2 = Number($("#lab23").val().replace(/,/g, "")); // 2개월
      var bonus3 = Number($("#lab26").val().replace(/,/g, "")); // 3개월
      var bonus4 = Number($("#lab33").val().replace(/,/g, "")); // 4개월
      var total_bonus = bonus1 + bonus2 + bonus3 + bonus4;
      arrRetirement[18] = util.commaNum(total_bonus);
      // console.log("기타수당 합계 : " + util.commaNum(total_bonus) + "원");
  
      // A: 3개월 기본급 + 기타수당
      var condition01 = total_basic + total_bonus;
      // B: 상여금 가산액[상여금*(3개월/12개월)]
      var condition02 = setYearly * (3 / 12);
      // C: 연차수당 가산액[(연차수당*5}*(3개월/12개월)]
      var condition03 = setAnnual * 5 * (3 / 12);
  
      // 퇴직일 이전 3개월간 지급받은 임금 총액(A+B+C)/퇴직일 이전 3개월간의 총 일수
      var totalSum = (condition01 + condition02 + condition03) / sumDate;
  
      totalSum = Math.floor(util.myRound(totalSum, 2) / 1) * 1;
      arrRetirement[16] = util.commaNum(totalSum);
      // console.log("\n1일 평균임금 : " + util.commaNum(totalSum) + "원");
  
      var prediction = totalSum * 30 * (termDays / 365);
  
      prediction = Math.floor(util.myRound(prediction, 2) / 10) * 10;
      arrRetirement[15] = util.commaNum(prediction);
      // console.log("예상퇴직금 : " + util.commaNum(prediction) + "원");
      // ================= 퇴직금(수당, 상여) 계산 ================= //
  
      return arrRetirement;
    },
    /**
     * 4대보험 계산
     * @param salary    월급여
     * @param workers   근로자수(0: 150인 미만,
     *                           1: 150이상(우선지원대상기업),
     *                           2: 150인 이상 1,000인 미만
     *                           3: 1,000인 이상)
     * 
     * @param accident  산재보험료율
     */
    insurance: function (salary, workers, accident) {
      var arrRetirement = [];
      var setSalary = salary;
      var setWorkers = workers;
      var setAccident = accident;
  
      // ==================== 국민연금 ==================== //
      var pension_worker = Math.floor((setSalary * GLOBAL_VALUE.NATIONAL_PENSION_RATE) / 10) * 10; // 근로자 부담금(월급여 * 근로자부담율(4.5%))
      var pension_business = Math.floor((setSalary * GLOBAL_VALUE.NATIONAL_PENSION_RATE) / 10) * 10; // 사업자 부담금(월급여 * 사업주부담율(4.5%))
      var pension_premium = pension_worker + pension_business; // 보험료 총액  (근로자부담금 + 사업주부담금)
      // console.log(
      //   "국민연금 > 근로자 부담금 : " + util.commaNum(pension_worker) + "원"
      // );
      arrRetirement[0] = util.commaNum(pension_worker);
      // console.log(
      //   "국민연금 > 사업자 부담금 : " + util.commaNum(pension_business) + "원"
      // );
      arrRetirement[1] = util.commaNum(pension_business);
      // console.log(
      //   "국민연금 > 보험료 총액 : " + util.commaNum(pension_premium) + "원"
      // );
      arrRetirement[2] = util.commaNum(pension_premium);
      // ==================== 국민연금 ==================== //
  
      // ==================== 건강보험 ==================== //
      var health_worker = Math.floor((setSalary * GLOBAL_VALUE.HEALTH_INSURE_RATE) / 10) * 10; // 월급여 * 근로자 부담율(3.495%)
      var health_business = Math.floor((setSalary * GLOBAL_VALUE.HEALTH_INSURE_RATE) / 10) * 10; // 월급여 * 사업주 부담율(3.495%)
      var health_premium = health_worker + health_business; // 근로자 부담금 + 사업주 부담금
      // console.log(
      //   "\n건강보험 > 근로자 부담금 : " + util.commaNum(health_worker) + "원"
      // );
      arrRetirement[3] = util.commaNum(health_worker);
      // console.log(
      //   "건강보험 > 사업자 부담금 : " + util.commaNum(health_business) + "원"
      // );
      arrRetirement[4] = util.commaNum(health_business);
      // console.log(
      //   "건강보험 > 보험료 총액 : " + util.commaNum(health_premium) + "원"
      // );
      arrRetirement[5] = util.commaNum(health_premium);
      // ==================== 건강보험 ==================== //
  
      // ==================== 건강보험(장기요양) ==================== //
      var care_premium = Math.floor((health_premium * GLOBAL_VALUE.HEALTH_INSURE_CARE_RATE) / 10) * 10; // 건강보험료 총액 * 12.27%
      var care_worker = Math.floor(care_premium / 2 / 10) * 10; // 근로자 부담금 50%
      var care_business = Math.floor(care_premium / 2 / 10) * 10; // 사업자 부담금 50%
  
      // console.log(
      //   "\n건강보험(장기요양) > 근로자 부담금 : " +
      //     util.commaNum(care_worker) +
      //     "원"
      // );
      arrRetirement[6] = util.commaNum(care_worker);
      // console.log(
      //   "건강보험(장기요양) > 사업자 부담금 : " +
      //     util.commaNum(care_business) +
      //     "원"
      // );
      arrRetirement[7] = util.commaNum(care_business);
      // console.log(
      //   "건강보험(장기요양) > 보험료 총액 : " + util.commaNum(care_premium) + "원"
      // );
      arrRetirement[8] = util.commaNum(care_premium);
      // ==================== 건강보험(장기요양) ==================== //
  
      // ==================== 고용보험 ==================== //
  
      if (setWorkers == 0) {
        //owner_total_text = "(150인 미만)";
        owner_total =
          Math.floor((setSalary * Number(GLOBAL_VALUE.EI_150L_OWNER)) / 10) * 10 +
          Math.floor((setSalary * Number(GLOBAL_VALUE.EI_UN_WORKER)) / 10) * 10;
      } else if (setWorkers == 1) {
        //owner_total_text = "(150이상(우선지원대상기업))";
        owner_total =
          Math.floor((setSalary * Number(GLOBAL_VALUE.EI_150H_OWNER)) / 10) * 10 +
          Math.floor((setSalary * Number(GLOBAL_VALUE.EI_UN_WORKER)) / 10) * 10;
      } else if (setWorkers == 3) {
        //owner_total_text = "(150인 이상 1,000인 미만)";
        owner_total =
          Math.floor((setSalary * Number(GLOBAL_VALUE.EI_1000L_OWNER)) / 10) * 10 +
          Math.floor((setSalary * Number(GLOBAL_VALUE.EI_UN_WORKER)) / 10) * 10;
      } else if (setWorkers == 2) {
        //owner_total_text = "(1,000인 이상)";
        owner_total =
          Math.floor((setSalary * Number(GLOBAL_VALUE.EI_1000H_OWNER)) / 10) * 10 +
          Math.floor((setSalary * Number(GLOBAL_VALUE.EI_UN_WORKER)) / 10) * 10;
      }
      // console.log(
      //   "\n사업주 부담액" +
      //     owner_total_text +
      //     " : " +
      //     util.commaNum(owner_total) +
      //     "원"
      // );
      arrRetirement[9] = util.commaNum(owner_total);
  
      var worker_total = Math.floor((setSalary * GLOBAL_VALUE.EI_UN_WORKER) / 10) * 10;
      arrRetirement[10] = util.commaNum(worker_total);
      // console.log("근로자 부담액 : " + util.commaNum(worker_total) + "원");
  
      arrRetirement[11] = util.commaNum(
        Math.floor((owner_total + worker_total) / 10) * 10
      );
      // console.log("총액 : " + util.commaNum(owner_total + worker_total) + "원");
      // ==================== 고용보험 ==================== //
  
      // ==================== 산재보험료율 ==================== //
  
      var accident_total = Math.floor((setSalary * setAccident) / 1000 / 10) * 10;
      // console.log("산재보험료율" + util.commaNum(accident_total) + "원");
      arrRetirement[12] = util.commaNum(accident_total);
  
      // ==================== 산재보험료율 ==================== //
  
      return arrRetirement;
    },
    /**
     * 급여계산기
     * @param division      0: 연봉, 1: 월급
     * @param severance     (퇴직금)0: 포함, 1: 미포함
     * @param taxFreeLb     비과세액
     * @param supportLb     부양가족수
     * @param annIncome     연봉
     */
    pay: function (severance, taxFreeLb, supportLb, annIncome) {
      const setDivision = 0;
      var setSeverance = severance;
      var setTaxFreeLb = taxFreeLb;
      var setSupportLb = supportLb;
      var setAnnIncome = annIncome;
  
      // 12명 이상부터는 11명 기준으로 계산
      if (11 < setSupportLb) {
        setSupportLb = 11;
      }
  
      // (연봉 - 비과세액)
      var minusPrice = 0;
      if (setSeverance == 0) {
        minusPrice = (setAnnIncome - setTaxFreeLb) / 13;
      } else {
        minusPrice = (setAnnIncome - setTaxFreeLb) / 12;
      }
  
      var arrSalaryPay = [];
  
      /**
       * 급여계산(공통)_국민연금
       * @type {number}
       */
      var salary_pension = salary.salary_pension(minusPrice);
      arrSalaryPay[1] = util.commaNum(salary_pension);
  
      /**
       * 급여계산(공통)_건강보험
       * @type {number}
       */
      var salary_health = salary.salary_health(minusPrice);
      arrSalaryPay[2] = util.commaNum(salary_health);
  
      /**
       * 급여계산(공통)_장기요양
       * @type {number}
       */
      var salary_care = salary.salary_care(salary_health);
      arrSalaryPay[3] = util.commaNum(salary_care);
  
      /**
       * 급여계산(공통)_고용보험
       * @type {number}
       */
      var salary_insurance = salary.salary_insurance(minusPrice);
      arrSalaryPay[4] = util.commaNum(salary_insurance);
  
      /**
       * 소득세계산(공통)_연간총급여액
       * @type {number}
       */
      var income_yearSalary = income.income_yearSalary(
        setDivision,
        setAnnIncome,
        setTaxFreeLb
      );
      // console.log("연간총급여액 : " + util.commaNum(income_yearSalary) + "원");
  
      /**
       * 소득세계산(공통)_근로소득공제(A)
       * @type {number}
       */
      var income_deduction = income.income_deduction(income_yearSalary);
      // console.log("근로소득공제(A) : " + util.commaNum(income_deduction) + "원");
  
      /**
       * 소득세계산(공통)_근로소득금액(B)
       * @type {number}
       */
      var income_amount = income.income_amount(
        income_yearSalary,
        income_deduction
      );
      // console.log("근로소득금액(B) : " + util.commaNum(income_amount) + "원");
  
      /**
       * 소득세계산(공통)_인적공제(C)
       * @type {number}
       */
      var income_personal = income.income_personal(setSupportLb);
      // console.log("인적공제(C) : " + util.commaNum(income_personal) + "원");
  
      /**
       * 소득세계산(공통)_연금보험료공제(D)
       * @type {number}
       */
      var income_pension = income.income_pension(income_yearSalary);
      // console.log("연금보험료공제(D) : " + util.commaNum(income_pension) + "원");
  
      /**
       * 소득세계산(공통)_특별소득공제(E)
       * @type {number}
       */
      var income_special = income.income_special(
        setAnnIncome,
        setSupportLb,
        income_yearSalary
      );
      // console.log("특별소득공제(E) : " + util.commaNum(income_special) + "원");
  
      /**
       * 소득세계산(공통)_과세표준(F)
       * @type {number}
       */
      var income_taxBase = income.income_taxBase(
        income_amount,
        income_personal,
        income_pension,
        income_special
      );
      // console.log("과세표준(F) : " + util.commaNum(income_taxBase) + "원");
  
      /**
       * 소득세계산(공통)_산출세액(G)
       * @type {number}
       */
      var income_calculatedTax = income.income_calculatedTax(income_taxBase);
      // console.log("산출세액(G) : " + util.commaNum(income_calculatedTax) + "원");
  
      /**
       * 소득세계산(공통)_근로소득세액공제(H)
       * @type {number}
       */
      var income_earned = income.income_earned(income_calculatedTax);
      // console.log("근로소득세액공제(H) : " + util.commaNum(income_earned) + "원");
  
      /**
       * 소득세계산(공통)_결정세액(I)
       * @type {number}
       */
      var income_determinedTax = income.income_determinedTax(
        income_calculatedTax,
        income_earned
      );
      // console.log("결정세액(I) : " + util.commaNum(income_determinedTax) + "원");
  
      /**
       * 소득세계산(공통)_간이세액
       * @type {number}
       */
      var income_simplifiedTax = income.income_simplifiedTax(
        income_determinedTax
      );
      arrSalaryPay[5] = util.commaNum(income_simplifiedTax);
      // console.log("간이세액 : " + util.commaNum(income_simplifiedTax) + "원");
  
      /**
       * 급여계산기(공통)_지방소득세
       * @type {number}
       */
      var salary_localTax = salary.salary_localTax(income_simplifiedTax);
      arrSalaryPay[6] = util.commaNum(salary_localTax);
  
      /**
       * 급여계산기(공통)_공제액 합계
       * @type {number}
       */
      var salary_totalDeductible = salary.salary_totalDeductible(
        salary_pension,
        salary_health,
        salary_care,
        salary_insurance,
        income_simplifiedTax,
        salary_localTax
      );
      arrSalaryPay[7] = util.commaNum(salary_totalDeductible);
  
      // ====================== 월 예상 실수령액 ====================== //
      var prediction = 0;
      if (setSeverance == 0) {
        // (연봉/13) - 공재액합계
        prediction = Math.floor(setAnnIncome / 13 - salary_totalDeductible);
        arrSalaryPay[0] = util.commaNum(prediction);
        //console.log("월 예상 실수령액 : " + util.commaNum(prediction) + "원");
      } else {
        // (월급/12) - 공재액합계
        prediction = Math.floor(setAnnIncome / 12 - salary_totalDeductible);
        arrSalaryPay[0] = util.commaNum(prediction);
        //console.log("월 예상 실수령액 : " + util.commaNum(prediction) + "원");
      }
      // ====================== 월 예상 실수령액 ====================== //
  
      return arrSalaryPay;
    },
    /**
     * 급여계산기(월급)
     * @param division      0: 연봉, 1: 월급
     * @param taxFreeLb     비과세액
     * @param supportLb     부양가족수
     * @param annIncome     월급
     */
    salary: function (taxFreeLb, supportLb, annIncome) {
      const setDivision = 1;
      var setTaxFreeLb = taxFreeLb;
      var setSupportLb = supportLb;
      var setAnnIncome = annIncome;
  
      // 12명 이상부터는 11명 기준으로 계산
      if (setSupportLb > 11) {
        setSupportLb = 11;
      }
  
      if (setTaxFreeLb > setAnnIncome) {
        //console.log("비과세는 월급보다 적어야 합니다.");
      } else {
        var arrSalary = [];
        // (월급 - 비과세액)
        var minusPrice = setAnnIncome - setTaxFreeLb;
        /**
         * 급여계산(공통)_국민연금
         * @type {number}
         */
        var salary_pension = salary.salary_pension(minusPrice);
        arrSalary[1] = util.commaNum(salary_pension);
        //console.log("국민연금 : " + util.commaNum(salary_pension) + "원");
  
        /**
         * 급여계산(공통)_건강보험
         * @type {number}
         */
        var salary_health = salary.salary_health(minusPrice);
        arrSalary[2] = util.commaNum(salary_health);
        //console.log("건강보험 : " + util.commaNum(salary_health) + "원");
  
        /**
         * 급여계산(공통)_장기요양
         * @type {number}
         */
        var salary_care = salary.salary_care(salary_health);
        arrSalary[3] = util.commaNum(salary_care);
        // console.log("장기요양 : " + util.commaNum(salary_care) + "원");
  
        /**
         * 급여계산(공통)_고용보험
         * @type {number}
         */
        var salary_insurance = salary.salary_insurance(minusPrice);
        arrSalary[4] = util.commaNum(salary_insurance);
        //console.log("고용보험 : " + util.commaNum(salary_insurance) + "원\n\n");
  
        /**
         * 소득세계산(공통)_연간총급여액
         * @type {number}
         */
        var income_yearSalary = income.income_yearSalary(
          setDivision,
          setAnnIncome,
          setTaxFreeLb
        );
        //console.log("연간총급여액 : " + util.commaNum(income_yearSalary) + "원");
  
        /**
         * 소득세계산(공통)_근로소득공제(A)
         * @type {number}
         */
        var income_deduction = income.income_deduction(income_yearSalary);
        // console.log("근로소득공제(A) : " + util.commaNum(income_deduction) + "원");
  
        /**
         * 소득세계산(공통)_근로소득금액(B)
         * @type {number}
         */
        var income_amount = income.income_amount(
          income_yearSalary,
          income_deduction
        );
        //console.log("근로소득금액(B) : " + util.commaNum(income_amount) + "원");
  
        /**
         * 소득세계산(공통)_인적공제(C)
         * @type {number}
         */
        var income_personal = income.income_personal(setSupportLb);
        //console.log("인적공제(C) : " + util.commaNum(income_personal) + "원");
  
        /**
         * 소득세계산(공통)_연금보험료공제(D)
         * @type {number}
         */
        var income_pension = income.income_pension(income_yearSalary);
        //console.log("연금보험료공제(D) : " + util.commaNum(income_pension) + "원");
  
        /**
         * 소득세계산(공통)_특별소득공제(E)
         * @type {number}
         */
        var income_special = income.income_special(
          setAnnIncome,
          setSupportLb,
          income_yearSalary
        );
        //console.log("특별소득공제(E) : " + util.commaNum(income_special) + "원");
  
        /**
         * 소득세계산(공통)_과세표준(F)
         * @type {number}
         */
        var income_taxBase = income.income_taxBase(
          income_amount,
          income_personal,
          income_pension,
          income_special
        );
        // console.log("과세표준(F) : " + util.commaNum(income_taxBase) + "원");
  
        /**
         * 소득세계산(공통)_산출세액(G)
         * @type {number}
         */
        var income_calculatedTax = income.income_calculatedTax(income_taxBase);
        //console.log("산출세액(G) : " + util.commaNum(income_calculatedTax) + "원");
  
        /**
         * 소득세계산(공통)_근로소득세액공제(H)
         * @type {number}
         */
        var income_earned = income.income_earned(income_calculatedTax);
        //console.log("근로소득세액공제(H) : " + util.commaNum(income_earned) + "원");
  
        /**
         * 소득세계산(공통)_결정세액(I)
         * @type {number}
         */
        var income_determinedTax = income.income_determinedTax(
          income_calculatedTax,
          income_earned
        );
        //console.log("결정세액(I) : " + util.commaNum(income_determinedTax) + "원");
  
        /**
         * 소득세계산(공통)_간이세액
         * @type {number}
         */
        var income_simplifiedTax = income.income_simplifiedTax(
          income_determinedTax
        );
        arrSalary[5] = util.commaNum(income_simplifiedTax);
        //console.log("간이세액 : " + util.commaNum(income_simplifiedTax) + "원\n\n");
  
        /**
         * 급여계산기(공통)_지방소득세
         * @type {number}
         */
        var salary_localTax = salary.salary_localTax(income_simplifiedTax);
        arrSalary[6] = util.commaNum(salary_localTax);
        // console.log("지방소득세 : " + util.commaNum(salary_localTax) + "원");
  
        /**
         * 급여계산기(공통)_공제액 합계
         * @type {number}
         */
        var salary_totalDeductible = salary.salary_totalDeductible(
          salary_pension,
          salary_health,
          salary_care,
          salary_insurance,
          income_simplifiedTax,
          salary_localTax
        );
        arrSalary[7] = util.commaNum(salary_totalDeductible);
        // console.log("공제액 합계 : " + util.commaNum(salary_totalDeductible) + "원\n\n");
  
        // ====================== 월 예상 실수령액 ====================== //
        // 월급 - 공제액합계
        var prediction = setAnnIncome - salary_totalDeductible;
        arrSalary[0] = util.commaNum(prediction);
        // console.log("월 예상 실수령액 : " + util.commaNum(prediction) + "원");
        // ====================== 월 예상 실수령액 ====================== //
      }
      return arrSalary;
    },
    /**
     * 부가세 - 합계금액으로 계산
     * @param totalSum      합계금액
     */
    vatSum: function (totalSum) {
      var arrTotalSum = [];
      var sumSupply = totalSum / 1.1; // 공급가액
      sumSupply = Math.round(sumSupply);
      var sumTax = totalSum - sumSupply; // 부가세액
      sumTax = Math.floor(sumTax / 1) * 1;
  
      arrTotalSum[0] = sumSupply; // 공급가액
      arrTotalSum[1] = sumTax; // 부가세액
      arrTotalSum[2] = sumSupply + sumTax;
  
      return arrTotalSum;
    },
    /**
     * 부가세 - 공급가액으로 계산
     * @param supplyPrice   공급가액
     */
    vatSupplyPrice: function (supplyPrice) {
      var arrSupplyPrice = [];
      var vatTax = supplyPrice / 10; // 부가세액
      vatTax = Math.round(vatTax);
      var vatTotal = supplyPrice + vatTax; // 합계금액
  
      arrSupplyPrice[0] = vatTax; // 부가세액
      arrSupplyPrice[1] = vatTotal; // 합계금액
  
      return arrSupplyPrice;
    },
  };
  
  //-----------------------------------------------------------------------
  // 기  능 : 공제액 합계(급여계산기 계산사용)
  // 작성자 : 이승환
  //-----------------------------------------------------------------------
  var salary = {
    /**
     * 급여계산(공통)_국민연금
     * @returns {number}
     */
    salary_pension: function (minusPrice) {
      // (연봉 or 월급 - 비과세액) * 4.5%(0.045)
      return Math.floor((minusPrice * GLOBAL_VALUE.NATIONAL_PENSION_RATE) / 10) * 10;
    },
    /**
     * 급여계산(공통)_건강보험
     * @returns {number}
     */
    salary_health: function (minusPrice) {
      // (연봉 - 비과세액) * 3.495%(0.03495)
      return Math.floor((minusPrice * GLOBAL_VALUE.HEALTH_INSURE_RATE) / 10) * 10;
    },
    /**
     * 급여계산(공통)_장기요양
     * @returns {number}
     */
    salary_care: function (medical) {
      // 건강보험 * 12.27%(0.1227)
      return Math.floor((medical * GLOBAL_VALUE.HEALTH_INSURE_CARE_RATE) / 10) * 10;
    },
    /**
     * 급여계산(공통)_고용보험
     * @returns {number}
     */
    salary_insurance: function (minusPrice) {
      // (연봉 - 비과세액) * 0.8%(0.008)
      return Math.floor((minusPrice * GLOBAL_VALUE.EI_UN_WORKER) / 10) * 10;
    },
    /**
     * 급여계산기(공통)_지방소득세
     * @returns {number}
     */
    salary_localTax: function (simplifiedTax) {
      var localIncomeTax = simplifiedTax * 0.1; // 간이세액 * 10%
      localIncomeTax = Math.floor(localIncomeTax / 10) * 10;
  
      return localIncomeTax;
    },
    /**
     * 급여계산기(공통)_공제액 합계
     * @returns {number}
     */
    salary_totalDeductible: function (
      pension,
      medical,
      care,
      employ,
      simplifiedTax,
      localIncomeTax
    ) {
      // 국민연금 + 건강보험 + 장기요양 + 고용보험 + 소득세 + 지방소득세
      var totalDeductible =
        pension + medical + care + employ + simplifiedTax + localIncomeTax;
      totalDeductible = Math.floor(totalDeductible / 10) * 10;
  
      return totalDeductible;
    },
  };
  
  //-----------------------------------------------------------------------
  // 기  능 : 소득세 합계(급여계산기 계산서용)
  // 작성자 : 이승환
  //-----------------------------------------------------------------------
  var income = {
    /**
     * 소득세계산(공통)_연간총급여액
     * @returns {number}
     */
    income_yearSalary: function (division, annIncome, taxFreeLb) {
      if (division == 0) {
        // 0: 연봉, 1: 월급
        return annIncome - taxFreeLb; // 연봉 - 비과세액
      } else {
        return (annIncome - taxFreeLb) * 12; // 월급 - 비과세액 * 12
      }
    },
    /**
     * 소득세계산(공통)_근로소득공제(A)
     * @returns {number}
     */
    income_deduction: function (annualSalary) {
      var earnedIncome = 0; // 초기화
  
      if (annualSalary <= 5000000) {
        // 총 급여액 구간 500만원 이하
        earnedIncome = (annualSalary * 70) / 100;
      } else if (annualSalary > 5000000 && annualSalary <= 15000000) {
        // 총 급여액 구간 500만원 초과 1,500만원 이하
        earnedIncome = 3500000 + (annualSalary - 5000000) * 0.4;
      } else if (annualSalary > 15000000 && annualSalary <= 45000000) {
        // 총 급여액 구간 1,500만원 초과 4,500만원 이하
        earnedIncome = 7500000 + (annualSalary - 15000000) * 0.15;
      } else if (annualSalary > 45000000 && annualSalary <= 100000000) {
        // 총 급여액 구간 4,500만원 초과 1억원 이하
        earnedIncome = 12000000 + (annualSalary - 45000000) * 0.05;
      } else if (annualSalary > 100000000) {
        // 1억원 초과
        earnedIncome = 14750000 + (annualSalary - 100000000) * 0.02;
      }
  
      return earnedIncome;
    },
    /**
     * 소득세계산(공통)_근로소득금액(B)
     * @returns {number}
     */
    income_amount: function (annualSalary, earnedIncome) {
      return annualSalary - earnedIncome; // 연간총급여액 - 근로소득공제(A)
    },
    /**
     * 소득세계산(공통)_인적공제(C)
     * @returns {number}
     */
    income_personal: function (setSupportLb) {
      return setSupportLb * 1500000; // 부양가족수 * 150만원
    },
    /**
     * 소득세계산(공통)_연금보험료공제(D)
     * @returns {number}
     */
    income_pension: function (annualSalary) {
      var pensionInsurance = 0; // 연금보험료
  
      if (annualSalary < 290000) {
        // 연간총급여액(290,000)이하인 경우
        pensionInsurance = 156600; // 156,600원으로 고정계산
      } else if (annualSalary < 4490000) {
        // 연간총급여액(4,490,000)이하인 경우
        pensionInsurance = 2424600; // 2,424,600원으로 고정계산
      } else {
        pensionInsurance = annualSalary * 0.045; // 기본값
      }
  
      return pensionInsurance;
    },
    /**
     * 소득세계산(공통)_특별소득공제(E)
     * @returns {number}
     */
    income_special: function (setAnnIncome, setSupportLb, annualSalary) {
      var specialIncome = 0; // 특별소득
  
      if (setAnnIncome <= 30000000) {
        // 3,000만원 이하
        if (setSupportLb == 1) {
          // 공제대상자 1명인 경우
          specialIncome = 3100000 + annualSalary * 0.04;
        } else if (setSupportLb == 2) {
          // 공제대상자 2명인 경우
          specialIncome = 3600000 + annualSalary * 0.04;
        } else if (setSupportLb == 3) {
          // 공제대상자 3명인 경우
          specialIncome =
            5000000 + annualSalary * 0.07 + (annualSalary - 40000000) * 0.04;
        }
      } else if (setAnnIncome > 30000000 && setAnnIncome <= 45000000) {
        // 3,000초과, 4,500만원이하
        if (setSupportLb == 1) {
          // 공제대상자 1명인 경우
          specialIncome =
            3100000 + annualSalary * 0.04 - (annualSalary - 30000000) * 0.05;
        } else if (setSupportLb == 2) {
          // 공제대상자 2명인 경우
          specialIncome =
            3600000 + annualSalary * 0.04 - (annualSalary - 30000000) * 0.05;
        } else if (setSupportLb == 3) {
          // 공제대상자 3명인 경우
          specialIncome =
            5000000 +
            annualSalary * 0.07 -
            (annualSalary - 30000000) * 0.05 +
            (annualSalary - 40000000) * 0.04;
        }
      } else if (setAnnIncome > 45000000 && setAnnIncome <= 70000000) {
        // 4,500초과, 7,000만원이하
        if (setSupportLb == 1) {
          // 공제대상자 1명인 경우
          specialIncome = 3100000 + annualSalary * 0.015;
        } else if (setSupportLb == 2) {
          // 공제대상자 2명인 경우
          specialIncome = 3600000 + annualSalary * 0.02;
        } else if (setSupportLb == 3) {
          // 공제대상자 3명인 경우
          specialIncome =
            5000000 + annualSalary * 0.05 + (annualSalary - 40000000) * 0.04;
        }
      } else if (setAnnIncome > 70000000 && setAnnIncome <= 120000000) {
        // 7,000초과, 1억2000만원이하
        if (setSupportLb == 1) {
          // 공제대상자 1명인 경우
          specialIncome = 3100000 + annualSalary * 0.05;
        } else if (setSupportLb == 2) {
          // 공제대상자 2명인 경우
          specialIncome = 3600000 + annualSalary * 0.01;
        } else if (setSupportLb == 3) {
          // 공제대상자 3명인 경우
          specialIncome =
            5000000 + annualSalary * 0.03 + (annualSalary - 40000000) * 0.04;
        }
      }
  
      return specialIncome;
    },
    /**
     * 소득세계산(공통)_과세표준(F)
     * @returns {number}
     */
    income_taxBase: function (
      earnedIncomePrice,
      personal,
      pensionInsurance,
      specialIncome
    ) {
      // 근로소득금액(B) - 인적공제© - 연금보험료공제(D) - 특별소득공제(E)
      return earnedIncomePrice - personal - pensionInsurance - specialIncome;
    },
    /**
     * 소득세계산(공통)_산출세액(G)
     * @returns {number}
     */
    income_calculatedTax: function (taxBase) {
      var calculatedTax = 0; // 산출세액(G)
  
      if (taxBase < 12000000) {
        // 1,200만원 이하
        calculatedTax = taxBase * 0.06;
      } else if (taxBase > 12000000 && taxBase <= 46000000) {
        // 1,200만원 초과 4,600만원 이하
        calculatedTax = 720000 + ((taxBase - 12000000) * 15) / 100;
      } else if (taxBase > 46000000 && taxBase <= 88000000) {
        // 4,600만원 초과 8,800만원 이하
        calculatedTax = 5820000 + ((taxBase - 46000000) * 24) / 100;
      } else if (taxBase > 88000000 && taxBase <= 150000000) {
        // 8,800만원 초과 1억5천만원 이하
        calculatedTax = 15900000 + ((taxBase - 88000000) * 35) / 100;
      } else if (taxBase > 150000000 && taxBase <= 300000000) {
        // 1억5천만원 초과 3억원 이하
        calculatedTax = 37600000 + ((taxBase - 150000000) * 38) / 100;
      } else if (taxBase > 300000000 && taxBase <= 500000000) {
        // 3억원 초과 5억원 이하
        calculatedTax = 94600000 + ((taxBase - 300000000) * 40) / 100;
      } else if (taxBase > 50000000) {
        // 5억원 초과
        calculatedTax = 174600000 + ((taxBase - 500000000) * 42) / 100;
      }
  
      return calculatedTax;
    },
    /**
     * 소득세계산(공통)_근로소득세액공제(H)
     * @returns {number}
     */
    income_earned: function (calculatedTax) {
      var earnedIncomeTax = 0; // 근로소득세액공제(H)
  
      if (calculatedTax <= 500000) {
        // 50만원 이하
        earnedIncomeTax = (calculatedTax * 55) / 100;
      } else {
        // 50만원 초과
        earnedIncomeTax = 275000 + ((calculatedTax - 500000) * 30) / 100;
      }
  
      return earnedIncomeTax;
    },
    /**
     * 소득세계산(공통)_결정세액(I)
     * @returns {number}
     */
    income_determinedTax: function (earnedIncomeTax, calculatedTax) {
      return earnedIncomeTax - calculatedTax; // 산출세액(G) - 근로소득세액공제(H)
    },
    /**
     * 소득세계산(공통)_간이세액
     * @returns {number}
     */
    income_simplifiedTax: function (determinedTax) {
      // 소득세가 마이너스 나올 경우 0으로 반환
      if(determinedTax < 0) return 0;
      
      var simplifiedTax = determinedTax / 12; // 결정세액(I) / 12개월
      simplifiedTax = Math.floor(simplifiedTax / 10) * 10;
  
      return simplifiedTax;
    },
  };
  
  //-----------------------------------------------------------------------
  // 기  능 : 계산기 유틸
  // 작성자 : 이승환
  //-----------------------------------------------------------------------
  var util = {
    /**
     * 숫에 1000단위로 콤마 구분자 넣기
     * use : 주휴수당, 시급계산
     * @param value         소수점이 없는 금액
     * @returns {string}    소수점이 있는 금액
     */
    commaNum: function (value) {
      return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    },
    /**
     * 입력받은 년,월의 최대 일을 구한다.
     * use : 퇴직금계산
     * @param yyyy  년
     * @param mm    월
     * @returns {number}    년,월을 합한 일 수
     */
    MaxdayYearMonth: function (yyyy, mm) {
      var monthDD = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
      var iMaxDay = 0;
      if (util.isLeafYear(yyyy)) {
        monthDD[1] = 29;
      }
      iMaxDay = monthDD[mm - 1];
      return iMaxDay;
    },
    /**
     * 입력받은 년도가 윤년이면 true
     * use : 퇴직금계산
     * @param YYYY
     * @returns {boolean}
     */
    isLeafYear: function (YYYY) {
      return (YYYY % 4 == 0 && YYYY % 100 != 0) || YYYY % 400 == 0;
    },
    myRound: function (num, pos) {
      var posV = Math.pow(10, pos ? pos : 2);
      return Math.floor(num * posV) / posV; //내림
    },
    /**
     *  yyyyMMdd 포맷으로 반환
     */
    getFormatDate: function (date) {
      var year = date.getFullYear(); //yyyy
      var month = 1 + date.getMonth(); //M
      month = month >= 10 ? month : "0" + month; //month 두자리로 저장
      var day = date.getDate(); //d
      day = day >= 10 ? day : "0" + day; //day 두자리로 저장
      return year + "-" + month + "-" + day; //'-' 추가하여 yyyy-mm-dd 형태 생성 가능
    },
  };
  