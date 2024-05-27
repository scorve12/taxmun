export default async function synthesis() {
    const htmlContent = `
    <div class="pt5 mt30" style="font-weight: 700;">
        <div class="floatl noto p25" style="width:58%;height:390px;position: relative;border:1px solid #d5d7e0;border-radius:5px;box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.1);">
            <div class="a_c mt1 mb10">
                <span class="f18 lh22">시급입력</span>
            </div>
            <table class="table-content table-style4 table-size-l">
                <colgroup>
                    <col style="width:130px;">
                    <col>
                </colgroup>
                <tbody class="f15">
                    <tr style="height: 51px;">
                        <th class="a_l" style="background-color: #ffffff;">시급</th>
                        <td style="background-color: #ffffff;">
                            <input type="text" class="form-l a_r" id="text00" style="width:200px;" value="9,860" maxlength="8"> 원
                        </td>
                    </tr>
                    <tr style="height: 51px;">
                        <th class="a_l" style="background-color: #ffffff;">일일 근무시간</th>
                        <td style="background-color: #ffffff;">
                            <select style="width:200px;" class="form-l" id="wageHour">
                                ${[...Array(24).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                            </select>
                            시간
                        </td>					
                    </tr>
                    <tr style="height: 51px;">
                        <th class="a_l" style="background-color: #ffffff;">한달 근무일수</th>
                        <td style="background-color: #ffffff;">
                            <select style="width:200px;" class="form-l" id="wageDay">
                                ${[...Array(31).keys()].map(i => `<option value="${i + 1}">${i + 1}</option>`).join('')}
                            </select>
                            일
                        </td>
                    </tr>
                    <tr style="height: 51px;">
                        <th class="a_l" style="background-color: #ffffff;">수습 <img src="https://image.barobill.co.kr/v7/content/calculator_info_icon.png" id="popupBtn1" alt="수습" style="vertical-align: middle;margin-bottom: 3px;cursor: pointer;" tooltip="wageProbation"></th>
                        <td style="background-color: #ffffff;">
                            <label class="pr10">
                                <input type="radio" name="wageProbation" class="rb" value="0" checked=""> <span class="f15">미포함</span>
                            </label>
                            <label>
                                <input type="radio" name="wageProbation" class="rb" value="1"> <span class="f15">포함</span>
                            </label>
                        </td>
                    </tr>
                    <tr style="height: 51px;">
                        <th class="a_l" style="background-color: #ffffff;">세금 <img src="https://image.barobill.co.kr/v7/content/calculator_info_icon.png" id="popupBtn2" alt="세금" style="vertical-align: middle;margin-bottom: 3px;cursor: pointer;" tooltip="wageTax"></th>
                        <td style="background-color: #ffffff;">
                            <label class="pr10">
                                <input type="radio" name="wageTax" class="rb" value="0" checked=""> <span class="f15">미적용</span>
                            </label>
                            <label class="pr10">
                                <input type="radio" name="wageTax" class="rb" value="0.0913"> <span class="f15">9.13%</span>
                            </label>
                            <label>
                                <input type="radio" name="wageTax" class="rb" value="0.033"> <span class="f15">3.3%</span>
                            </label>
                        </td>
                    </tr>
                </tbody>
            </table>	
            <div class="a_c mt15">
                <a class="btn btn-l btn-gray3 mr3 btnReset">초기화</a>
                <a class="btn btn-l btn-red btnPrimary">계산하기</a>
            </div>
            <p class="f13 msgbox01" id="msgbox01" style="position: absolute;top: 99px;left: 175px;color: rgb(250, 72, 72);font-weight: 500;display: none;">현재 계약된 시급을 입력해주세요.</p>
        </div>
        <div class="floatr noto p25" style="width:40%;height:390px;border:1px solid #a7b1e8;border-radius:5px;box-shadow: 1px 1px 5px 0px rgba(0,0,0,0.1);">
            <div class="a_c mt1 mb20">
                <span class="f18 lh22">예상 실수령액/월</span>
            </div>
            <div class="a_c settle-amount mt25 mb15 p13" style="width: 100%;background-color: #f7f6f6;border-radius: 6px;">
                <p class="f40 blue2">
                    <span id="getWageSigeub">0</span><span class="f20 ml5">원</span>
                </p>
            </div>
            <table class="table-list table-style4 table-size-l">
                <tbody class="f15">
                    <tr>
                        <th class="a_l" style="background-color: #ffffff;">시급</th>
                        <td class="a_r" style="background-color: #ffffff;padding-left: 3px;padding-right: 3px;">
                            <p style="color: #6b6b6b;"><span id="getWagePay">0</span> 원</p>
                        </td>
                    </tr>
                    <tr>
                        <th class="a_l" style="background-color: #ffffff;">근무시간</th>
                        <td class="a_r" style="background-color: #ffffff;padding-left: 3px;padding-right: 3px;">
                            <p style="color: #6b6b6b;"><span id="getWageDate">0</span> 시간</p>
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


