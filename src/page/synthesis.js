// 요율 정의
const GLOBAL_VALUE = {
    EI_UN_WORKER: 0.009, // 고용보험 실업급여 근로자
    EI_150L_OWNER: 0.0025, // 고용보험 150미만 사업주
    EI_150H_OWNER: 0.0045, // 고용보험 150이상 사업주
    EI_1000L_OWNER: 0.0065, // 고용보험 1000미만 사업주
    EI_1000H_OWNER: 0.0085, // 고용보험 1000이상 사업주
    NATIONAL_PENSION_RATE: 0.045, // 국민연금: 전체: 9%, 근로자: 4.5%, 사업주: 4.5%
    HEALTH_INSURE_RATE: 0.03545, // 건강보험: 전체: 7.09%, 근로자: 3.545%, 사업주: 3.545%
    HEALTH_INSURE_CARE_RATE: 0.1295, // 장기요양(건강보험): 전체: 12.95%, 근로자, 사업주: 각각 50%
};

// 보험료 계산 함수
function calculateInsurance(salary, workers, accident) {
    let workerRate, ownerRate;

    switch (workers) {
        case 0:
            workerRate = GLOBAL_VALUE.EI_150L_OWNER;
            ownerRate = GLOBAL_VALUE.EI_150H_OWNER;
            break;
        case 1:
            workerRate = GLOBAL_VALUE.EI_150H_OWNER;
            ownerRate = GLOBAL_VALUE.EI_150H_OWNER;
            break;
        case 2:
            workerRate = GLOBAL_VALUE.EI_1000L_OWNER;
            ownerRate = GLOBAL_VALUE.EI_1000L_OWNER;
            break;
        case 3:
            workerRate = GLOBAL_VALUE.EI_1000H_OWNER;
            ownerRate = GLOBAL_VALUE.EI_1000H_OWNER;
            break;
        default:
            workerRate = 0;
            ownerRate = 0;
    }

    const pensionWorker = Math.floor((salary * GLOBAL_VALUE.NATIONAL_PENSION_RATE) / 10) * 10;
    const pensionOwner = Math.floor((salary * GLOBAL_VALUE.NATIONAL_PENSION_RATE) / 10) * 10;
    const healthWorker = Math.floor((salary * GLOBAL_VALUE.HEALTH_INSURE_RATE) / 10) * 10;
    const healthOwner = Math.floor((salary * GLOBAL_VALUE.HEALTH_INSURE_RATE) / 10) * 10;
    const careWorker = Math.floor((healthWorker * GLOBAL_VALUE.HEALTH_INSURE_CARE_RATE) / 10) * 10;
    const careOwner = Math.floor((healthOwner * GLOBAL_VALUE.HEALTH_INSURE_CARE_RATE) / 10) * 10;
    const employWorker = Math.floor((salary * GLOBAL_VALUE.EI_UN_WORKER) / 10) * 10;
    const employOwner = Math.floor((salary * ownerRate) / 10) * 10;
    const accidentTotal = Math.floor((salary * accident) / 10) * 10;

    return {
        total: pensionWorker + pensionOwner + healthWorker + healthOwner + careWorker + careOwner + employWorker + employOwner + accidentTotal,
        worker: pensionWorker + healthWorker + careWorker + employWorker,
        owner: pensionOwner + healthOwner + careOwner + employOwner + accidentTotal,
        health: {
            total: healthWorker + healthOwner,
            worker: healthWorker,
            owner: healthOwner
        },
        care: {
            total: careWorker + careOwner,
            worker: careWorker,
            owner: careOwner
        },
        employ: {
            total: employWorker + employOwner,
            worker: employWorker,
            owner: employOwner
        },
        accident: {
            total: accidentTotal,
            worker: 0,
            owner: accidentTotal
        }
    };
}

export default async function synthesis() {
    const htmlContent = `
        <div class="pt5 mt30" style="font-weight: 700;">
            <div class="floatl noto p20" style="width:100%;height:120px;position: relative;border:1px solid #d5d7e0;border-radius:5px;box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.1);">
                <div class="a_c mt1 mb20">
                    <span class="f18 lh22">월 급여/근로자수 입력</span>
                </div>
                <div class="f15 a_c mt20">
                    월 급여
                    <input class="a_r ml4 mr4" type="text" id="getText00" value="" style="width: 99px;">
                    원
                    <span class="gray1 ml10 mr10 dotum n">|</span>
                    근로자수            
                    <select style="width:150px;" class="getSelect01" id="getSelect01">
                        <option value="0">150인 미만 기업</option>
                        <option value="1">150이상 기업(우선지원대상기업)</option>
                        <option value="2">150인 이상 1,000인 미만 기업</option>
                        <option value="3">1,000인 이상 기업, 국가 지방자치단체</option>
                    </select>
                    원
                    <span class="gray1 ml10 mr10 dotum n">|</span>
                    산재보험료율
                    <input class="a_r" type="text" id="getText02" value="" style="width: 99px;"> <a class="btn btn-gray3" href="https://www.comwel.or.kr/comwel/paym/insu/chek1.jsp" target="_blank">알아보기</a>
                </div>
                <p class="f13" id="msgbox00" style="position: absolute;top: 91px;left: 89px;color: rgb(250, 72, 72);font-weight: 500;display: none;">월 급여를 입력해주세요.</p>
                <p class="f13" id="msgbox01" style="position: absolute;top: 91px;left: 573px;color: rgb(250, 72, 72);font-weight: 500;display: none;">산재보험료율을 입력해주세요.</p>
            </div>

            <div class="floatr noto p25 mt30" style="width:100%;border:1px solid #a7b1e8;border-radius:5px;box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.1);">
                <div class="a_c mt5 mb20">
                    <span class="f18 lh22">예상 4대보험 총액</span>
                </div>

                <table summary="전체 보험료 계산 결과입니다." class="table-list table-size-l mt10">
                    <thead>
                        <tr class="f14">
                            <th scope="col">구분</th>
                            <th scope="col">보험료 총액</th>
                            <th scope="col">근로자 부담금</th>
                            <th scope="col">사업주 부담금</th>
                            <th scope="col" style="width:100px;"></th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="a_c">
                            <td class="f14">국민연금 <img src="https://image.barobill.co.kr/v7/content/calculator_info_icon.png" alt="국민연금" id="popupBtn1" tooltip="popupBtn1" style="vertical-align: middle;margin-bottom: 3px;cursor: pointer;"></td>
                            <td class="a_r f14"><span id="lab11"></span> 원</td>
                            <td class="a_r f14"><span id="lab12"></span> 원</td>
                            <td class="a_r f14"><span id="lab13"></span> 원</td>
                            <td><a class="btn btn-x btn-red btnPrimary01">계산하기</a></td>
                        </tr>
                        <tr class="a_c">
                            <td class="f14">건강보험 <img src="https://image.barobill.co.kr/v7/content/calculator_info_icon.png" alt="건강보험" id="popupBtn2" tooltip="popupBtn2" style="vertical-align: middle;margin-bottom: 3px;cursor: pointer;"></td>
                            <td class="a_r f14"><span id="lab21"></span> 원</td>
                            <td class="a_r f14"><span id="lab22"></span> 원</td>
                            <td class="a_r f14"><span id="lab23"></span> 원</td>
                            <td><a class="btn btn-x btn-red btnPrimary02">계산하기</a></td>
                        </tr>
                        <tr class="a_c">
                            <td class="f14">건강보험(장기요양) <img src="https://image.barobill.co.kr/v7/content/calculator_info_icon.png" alt="건강보험(장기요양)" id="popupBtn3" tooltip="popupBtn3" style="vertical-align: middle;margin-bottom: 3px;cursor: pointer;"></td>
                            <td class="a_r f14"><span id="lab24"></span> 원</td>
                            <td class="a_r f14"><span id="lab25"></span> 원</td>
                            <td class="a_r f14"><span id="lab26"></span> 원</td>
                            <td><a class="btn btn-x btn-red btnPrimary03">계산하기</a></td>
                        </tr>
                        <tr class="a_c">
                            <td class="f14">고용보험 <img src="https://image.barobill.co.kr/v7/content/calculator_info_icon.png" alt="고용보험" id="popupBtn4" tooltip="popupBtn4" style="vertical-align: middle;margin-bottom: 3px;cursor: pointer;"></td>
                            <td class="a_r f14"><span id="lab31"></span> 원</td>
                            <td class="a_r f14"><span id="lab34"></span> 원</td>
                            <td class="a_r f14"><span id="lab33"></span> 원</td>
                            <td><a class="btn btn-x btn-red btnPrimary04">계산하기</a></td>
                        </tr>
                        <tr class="a_c">
                            <td class="f14">산재보험료 <img src="https://image.barobill.co.kr/v7/content/calculator_info_icon.png" alt="산재보험료" id="popupBtn5" tooltip="popupBtn5" style="vertical-align: middle;margin-bottom: 3px;cursor: pointer;"></td>
                            <td class="a_r f14"><span id="lab35"></span> 원</td>
                            <td class="a_r f14 lab36"><span id="lab36"></span> 원</td>
                            <td class="a_r f14"><span id="lab37"></span> 원</td>
                            <td><a class="btn btn-x btn-red btnPrimary05">계산하기</a></td>
                        </tr>
                    </tbody>
                </table>

                <table class="table-list table-style4 table-size-l mt10">
                    <tbody>
                        <tr class="a_c" style="height: 124px;">
                            <td style="background-color: #ffffff;">
                                <div class="a_c settle-amount mt25 mb15 p13" style="width: 100%;background-color: #f7f6f6;border-radius: 6px;">
                                    <p class="f40 blue2">
                                        <span id="getValue01">0</span><span class="f20 ml5">원</span>
                                    </p>
                                </div>
                            </td>
                            <td style="background-color: #ffffff;">
                                <table class="table-list table-style4 table-size-l mt7">
                                    <tbody>
                                        <tr class="f15">
                                            <th class="a_l" style="background-color: #ffffff;">근로자부담금</th>
                                            <td class="a_r" style="background-color: #ffffff;padding-left: 3px;padding-right: 3px;">
                                                <p style="color: #6b6b6b;"><span id="getValue02">0</span> 원</p>
                                            </td>
                                        </tr>
                                        <tr class="f15">
                                            <th class="a_l" style="background-color: #ffffff;">사업주부담금</th>
                                            <td class="a_r" style="background-color: #ffffff;padding-left: 3px;padding-right: 3px;">
                                                <p style="color: #6b6b6b;"><span id="getValue03">0</span> 원</p>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>	
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
            
            <div class="clearb"></div>	
        </div>
    `;

    // HTML 컨텐츠 반환
    return htmlContent;
}

// 이벤트 리스너 추가
document.addEventListener('DOMContentLoaded', function() {
    document.body.addEventListener('click', function(event) {
        if (event.target.classList.contains('btnPrimary01') || 
            event.target.classList.contains('btnPrimary02') || 
            event.target.classList.contains('btnPrimary03') || 
            event.target.classList.contains('btnPrimary04') || 
            event.target.classList.contains('btnPrimary05')) {

            const salary = parseFloat(document.getElementById('getText00').value);
            const workers = parseInt(document.getElementById('getSelect01').value);
            const accident = parseFloat(document.getElementById('getText02').value);
            
            if (isNaN(salary) || salary <= 0) {
                document.getElementById('msgbox00').style.display = 'block';
                return;
            } else {
                document.getElementById('msgbox00').style.display = 'none';
            }
            
            if (isNaN(accident) || accident <= 0) {
                document.getElementById('msgbox01').style.display = 'block';
                return;
            } else {
                document.getElementById('msgbox01').style.display = 'none';
            }

            const result = calculateInsurance(salary, workers, accident);

            document.getElementById('lab11').innerText = result.total;
            document.getElementById('lab12').innerText = result.worker;
            document.getElementById('lab13').innerText = result.owner;
            document.getElementById('lab21').innerText = result.health.total;
            document.getElementById('lab22').innerText = result.health.worker;
            document.getElementById('lab23').innerText = result.health.owner;
            document.getElementById('lab24').innerText = result.care.total;
            document.getElementById('lab25').innerText = result.care.worker;
            document.getElementById('lab26').innerText = result.care.owner;
            document.getElementById('lab31').innerText = result.employ.total;
            document.getElementById('lab34').innerText = result.employ.worker;
            document.getElementById('lab33').innerText = result.employ.owner;
            document.getElementById('lab35').innerText = result.accident.total;
            document.getElementById('lab36').innerText = result.accident.worker;
            document.getElementById('lab37').innerText = result.accident.owner;
            
            document.getElementById('getValue01').innerText = result.total;
            document.getElementById('getValue02').innerText = result.worker;
            document.getElementById('getValue03').innerText = result.owner;
        }
    });
});
