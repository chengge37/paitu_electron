<!--  -->
<template>
  <div class="form-box">
    <el-tabs v-model="activeProgress">
      <el-tab-pane label="创建" name="createMiniApp">
        <p style="margin-bottom:10px">这一步是创建小程序，提交以下数据会给法人微信推送一条验证消息，24小时内有效，超时未验证需要重新申请</p>
        <el-row :gutter="20">
          <el-col :span="14" :offset="4">
            <div>
              <el-form
                ref="createMiniAppForm"
                :model="createMiniAppForm"
                :rules="rules"
                label-width="140px"
                label-position="left"
                :disabled="disableCreate"
              >
                <el-form-item label="法人微信：" prop="legal_persona_wechat">
                  <el-input
                    v-model="createMiniAppForm.legal_persona_wechat"
                    placeholder="请输入法人微信号（大于6个字符）"
                  ></el-input>
                </el-form-item>
                <el-form-item label="法人姓名：" prop="legal_persona_name">
                  <el-input v-model="createMiniAppForm.legal_persona_name" placeholder="请输入法人姓名"></el-input>
                </el-form-item>
                <el-form-item label="公司类别：" prop="organization_type">
                  <div class="company">
                    <el-select v-model="createMiniAppForm.organization_type" placeholder="请选择">
                      <el-option
                        v-for="item in organization_type_options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                      ></el-option>
                    </el-select>
                  </div>
                </el-form-item>
                <el-form-item label="企业名称：" prop="company_name">
                  <el-input v-model="createMiniAppForm.company_name" placeholder="请输入企业名称"></el-input>
                </el-form-item>
                <el-form-item label="营业执照号" prop="business_license_number">
                  <el-input v-model="createMiniAppForm.business_license_number" placeholder="请输入"></el-input>
                </el-form-item>
                <el-form-item label="小程序id">
                  <el-input
                    v-model="createMiniAppForm.wx_app_id"
                    placeholder="生成后有小程序id"
                    :disabled="true"
                  ></el-input>
                </el-form-item>
                <el-form-item label="创建状态">
                  <span>{{createMiniAppForm.mini_app_status|miniAppStatusFilter(createMiniAppStatus)}}</span>
                  <span
                    v-if="createMiniAppForm.mini_app_status==createMiniAppStatus.fail||createMiniAppForm.mini_app_status==createMiniAppStatus.ing"
                  >{{createMiniAppForm.mini_app_msg}}</span>
                  <el-button type="info" size="mini" @click="getCreateStatus">查询状态</el-button>
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>

        <div class="bottom-button">
          <el-button
            :loading="createLoading"
            :disabled="disableCreate"
            type="primary"
            @click="createMiniApp"
          >创建</el-button>
          <el-button @click="$router.go(-1)">取消</el-button>
        </div>
      </el-tab-pane>
      <el-tab-pane label="配置" name="setMiniApp">
        <el-row :gutter="20">
          <el-col :span="14" :offset="4">
            <div>
              <el-form label-width="140px" label-position="left">
                <el-form-item label="查看小程序基本信息">
                  <p>线上自定义版本:{{setForm.online_version}}</p>
                  <el-button
                    :loading="queryMiniAppInfoLoading"
                    @click="queryMiniAppInfo"
                    size="mini"
                    type="primary"
                  >查看</el-button>
                </el-form-item>
                <el-form-item label="设置服务器：">
                  <el-button
                    :loading="setDomainLoading"
                    @click="setDomain"
                    size="mini"
                    type="primary"
                  >设置服务器</el-button>
                  <el-tag size="mini">{{optStatus|optFilter(SelfMiniAppOptCode.WxOptSetDomain)}}</el-tag>
                </el-form-item>
                <el-form-item label="设置业务服务器：">
                  <el-button
                    :loading="setWorkDomainLoading"
                    @click="setWorkDomain"
                    size="mini"
                    type="primary"
                  >设置业务服务器</el-button>
                  <el-tag size="mini">{{optStatus|optFilter(SelfMiniAppOptCode.WxOptSetWorkDomain)}}</el-tag>
                </el-form-item>
                <el-form-item label="设置业务服务器：">
                  <el-button
                    :loading="setCategoryLoading"
                    @click="setCategory"
                    size="mini"
                    type="primary"
                  >设置类目</el-button>
                  <el-tag size="mini">{{optStatus|optFilter(SelfMiniAppOptCode.WxOptSetCategory)}}</el-tag>
                </el-form-item>
                <el-form-item label="上传小程序ICON">
                  <el-row>
                    <el-col :span="6">
                      <OneImgUpload :image-url="setForm.mini_app_icon_qiniu" />
                    </el-col>
                    <el-col :span="6">
                      <el-button :loading="setIconLoading" type="primary" @click="setIcon">设置</el-button>
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="上传营业执照：">
                  <el-row>
                    <el-col :span="6">
                      <OneImgUpload
                        v-model="setForm.company_license_pic_qiniu"
                        :width_ratio="1.63"
                      />
                    </el-col>
                  </el-row>
                </el-form-item>
                <el-form-item label="设置名称：">
                  <el-input v-model="setForm.mini_app_name" placeholder="请输入小程序名"></el-input>
                  <el-button
                    :loading="setNameLoading"
                    @click="setName"
                    size="mini"
                    type="primary"
                  >设置</el-button>
                  <el-tag size="mini">{{optStatus|optFilter(SelfMiniAppOptCode.WxOptSetName)}}</el-tag>
                  <span v-if="!util.isEmpty(setForm.name_audit_id)">审核ID:{{setForm.name_audit_id}}</span>
                  <el-button
                    v-if="!util.isEmpty(setForm.name_audit_id)"
                    :loading="queryNameLoading"
                    @click="queryName"
                    size="mini"
                    type="primary"
                  >查询名称审核状态</el-button>
                </el-form-item>
                <el-form-item label="设置描述：">
                  <el-input v-model="setForm.info" placeholder="请输入小程序描述"></el-input>
                  <el-button
                    :loading="setInfoLoading"
                    @click="setInfo"
                    size="mini"
                    type="primary"
                  >设置</el-button>
                  <el-tag size="mini">{{optStatus|optFilter(SelfMiniAppOptCode.WxOptSetInfo)}}</el-tag>
                </el-form-item>
                <el-form-item label="设置代码：">
                  <p>线上自定义版本:{{setForm.online_version}}线上模板版本:{{setForm.online_tpl_version}}系统最新模板版本:{{setForm.last_tpl_version}}</p>
                  <span>系统最新模板版本>线上模板版本的时候才可以设置（更新）,自定义版本没有硬性连续性要求，但要遵循1.0.0这样的格式</span>
                  <el-input v-model="setForm.audit_version" placeholder="请输入自定义版本"></el-input>
                  <el-button :loading="setTplLoading" @click="setTpl" size="mini" type="primary">设置</el-button>
                  <el-tag size="mini">{{optStatus|optFilter(SelfMiniAppOptCode.WxOptUploadTpl)}}</el-tag>
                </el-form-item>
                <el-form-item label="审核：">
                  <el-button
                    :loading="commitLoading"
                    @click="setCommit"
                    size="mini"
                    type="primary"
                  >提交审核</el-button>
                  <span>审核ID:{{setForm.mini_app_audit_id}}</span>
                  <el-button
                    :loading="commitLoading"
                    @click="queryCommit"
                    size="mini"
                    type="primary"
                  >查询审核</el-button>
                  <el-button
                    :loading="commitLoading"
                    @click="releaseCommit"
                    size="mini"
                    type="primary"
                  >发布</el-button>
                  <p>{{setForm.mini_app_audit_status|auditStatusFilter(SelfWxAppAuditStatus)}}</p>
                  <p
                    v-if="setForm.mini_app_audit_status==SelfWxAppAuditStatus.WxAppAuditStatusFail"
                    v-html="setForm.mini_app_audit_msg"
                  ></p>
                </el-form-item>
                <el-form-item label="二维码：">
                  <el-button :loading="genQRLoading" @click="genQR" size="mini" type="primary">生成二维码</el-button>
                  <img :src="setForm.qr_code_url" />
                </el-form-item>
              </el-form>
            </div>
          </el-col>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="支付" name="configPay">
        <p>配置支付</p>
        <el-row :gutter="20">
          <el-col :span="16" :offset="4">
            <div>
              <el-form
                ref="payForm"
                :model="payForm"
                :rules="rules"
                label-width="200px"
                label-position="left"
              >
                <el-collapse v-model="activePayGroupName">
                  <el-collapse-item title="法人信息" name="1">
                    <el-form-item label="姓名">
                      <el-input
                        :disabled="true"
                        v-model="createMiniAppForm.legal_persona_name"
                        placeholder="姓名"
                      ></el-input>
                    </el-form-item>
                    <el-form-item label="联系手机" prop="contact_phone">
                      <el-input v-model="payForm.contact_phone" placeholder="姓名"></el-input>
                    </el-form-item>
                    <el-form-item label="联系邮箱" prop="contact_email">
                      <el-input v-model="payForm.contact_email" placeholder="邮箱"></el-input>
                    </el-form-item>
                    <el-form-item label="身份证号" prop="id_card_number">
                      <el-input v-model="payForm.id_card_number" placeholder="身份证号"></el-input>
                    </el-form-item>

                    <el-row>
                      <el-col :span="12">
                        <el-form-item label="身份证人像面" prop="id_card_copy_qiniu">
                          <OneImgUpload v-model="payForm.id_card_copy_qiniu" :width_ratio="0.63" />
                        </el-form-item>
                      </el-col>
                      <el-col :span="12">
                        <el-form-item label="身份证国徽面" prop="id_card_national_qiniu">
                          <OneImgUpload
                            v-model="payForm.id_card_national_qiniu"
                            :width_ratio="0.63"
                          />
                        </el-form-item>
                      </el-col>
                    </el-row>

                    <el-form-item prop="id_card_valid_time" label="身份证有效期(有效期结束必须晚于现在60天)">
                      <validDatePicker v-model="payForm.id_card_valid_time"></validDatePicker>
                    </el-form-item>
                  </el-collapse-item>
                  <el-collapse-item title="主体资料" name="2">
                    <el-form-item label="公司名">
                      <el-input v-model="createMiniAppForm.company_name" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item v-if="needOrg" label="组织结构代码号" prop="organization_number">
                      <el-input v-model="payForm.organization_number" placeholder="组织结构代码号"></el-input>
                    </el-form-item>
                    <el-form-item v-if="needOrg" label="组织结构代码照片" prop="organization_copy_qiniu">
                      <el-row>
                        <el-col :span="6">
                          <OneImgUpload
                            v-model="payForm.organization_copy_qiniu"
                            :width_ratio="1.4"
                          />
                        </el-col>
                      </el-row>
                    </el-form-item>
                    <el-form-item
                      prop="organization_time"
                      v-if="needOrg"
                      label="组织结构代码有效期(有效期结束必须晚于现在60天)"
                    >
                      <validDatePicker v-model="payForm.organization_time"></validDatePicker>
                    </el-form-item>
                  </el-collapse-item>
                  <el-collapse-item title="经营资料" name="3">
                    <el-form-item label="客服电话" prop="service_phone">
                      <el-input v-model="payForm.service_phone" placeholder="客服电话,在交易记录中向买家展示"></el-input>
                    </el-form-item>
                  </el-collapse-item>
                  <el-collapse-item title="结算银行账户" name="4">
                    <!-- 个人卡 -->
                    <div v-if="isPersonal">
                      <el-form-item label="开户名">
                        <el-input
                          :disabled="true"
                          v-model="createMiniAppForm.legal_persona_name"
                          placeholder="开户名"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="个人卡开户银行" prop="account_bank">
                        <el-select v-model="payForm.account_bank" placeholder="请选择">
                          <el-option
                            v-for="item in banklist"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="开户银行省市编码" prop="bank_address_code">
                        <el-cascader
                          placeholder="试试搜索自己所在的省名"
                          :options="cityOptions"
                          filterable
                          v-model="payForm.bank_address_code"
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item label="开户银行全称（含支行）" prop="bank_name">
                        <el-autocomplete
                          v-model="payForm.bank_name"
                          value-key="bank"
                          :fetch-suggestions="querySearchBankAsync"
                          placeholder="请输入开户银行全称（含支行）"
                        ></el-autocomplete>
                      </el-form-item>
                      <el-form-item label="银行卡号" prop="account_number">
                        <el-input v-model="payForm.account_number"></el-input>
                      </el-form-item>
                    </div>
                    <!-- 个人卡END -->
                    <!-- 对公卡 -->
                    <div v-if="isCorp">
                      <el-form-item label="开户名">
                        <el-input
                          :disabled="true"
                          v-model="createMiniAppForm.company_name"
                          placeholder="开户名"
                        ></el-input>
                      </el-form-item>
                      <el-form-item label="对公户开户银行" prop="company_account_bank">
                        <el-select v-model="payForm.company_account_bank" placeholder="请选择">
                          <el-option
                            v-for="item in banklist"
                            :key="item.id"
                            :label="item.name"
                            :value="item.name"
                          ></el-option>
                        </el-select>
                      </el-form-item>
                      <el-form-item label="对公户开户行省市编码" prop="company_bank_address_code">
                        <el-cascader
                          placeholder="试试搜索自己所在的省名"
                          :options="cityOptions"
                          filterable
                          v-model="payForm.company_bank_address_code"
                        ></el-cascader>
                      </el-form-item>
                      <el-form-item
                        v-if="isOtherBank"
                        label="对公户银行全称（含支行）"
                        prop="company_bank_name"
                      >
                        <el-autocomplete
                          v-model="payForm.company_bank_name"
                          value-key="bank"
                          :fetch-suggestions="querySearchBankAsync"
                          placeholder="请输入开户银行全称（含支行）"
                        ></el-autocomplete>
                      </el-form-item>
                      <el-form-item label="对公户卡号" prop="company_account_number">
                        <el-input v-model="payForm.company_account_number"></el-input>
                      </el-form-item>
                    </div>
                    <!-- 个人卡END -->
                  </el-collapse-item>
                  <el-collapse-item title="申请" name="5">
                    <el-form-item label="申请ID">
                      {{payStatusForm.pay_applyment_id}}
                      <el-button :loading="queryPayLoading" type="primary" @click="queryPay">查询申请状态</el-button>
                    </el-form-item>
                    <el-form-item
                      label="申请状态"
                    >{{payStatusForm.pay_applyment_status|payApplymentStatusFilter}}</el-form-item>
                    <el-form-item label="签约URL">
                      <img :src="payStatusForm.pay_applyment_sign_url" />
                    </el-form-item>
                    <el-form-item label="申请消息">
                      <div style="line-height:18px" v-html="payStatusForm.pay_applyment_msg"></div>
                    </el-form-item>
                  </el-collapse-item>
                </el-collapse>
              </el-form>
            </div>
          </el-col>
          <div class="bottom-button">
            <el-row>
              <el-col :span="24">
                <el-button :loading="applyPayLoading" type="primary" @click="applyPay">申请支付</el-button>
              </el-col>
            </el-row>
          </div>
        </el-row>
      </el-tab-pane>
    </el-tabs>

    <appInfoDialog
      :show="appInfoDialogVisable"
      :appInfo="appInfo"
      :appInfoDialogCloseMsg="appInfoDialogVisable = false"
    ></appInfoDialog>

    <el-dialog title="派图租赁专享小程序订购协议" :visible.sync="showxy">
      <div>
        <div class="text-box">
          <p>
            欢迎订购派图租赁小程序服务（下称“小程序”），您订购的小程序服务是由珠海穿山甲科技有限责任公司（以下简称“派图租赁”）通过派图租赁平台相关功能向您提供的服务。在您使用小程序服务之前，您应当仔细阅读并遵守本《派图租赁小程序订购协议》（下称“本协议”），本协议由您与派图租赁之间共同签署，并具有合同效力，请您务必审慎阅读、充分理解并遵守本协议，一旦您点击确认本协议，即表示您已接受了以下所述的条款内容，同意受本协议约束。如果您不同意接受全部的条款，那么您将无法订购和使用小程序服务。本协议包括正文以及所有派图租赁已经发布或将来可能发布的相关规则，
            <b>特别是限制或免除责任的相应条款、争议解决和法律适用条款。限制或免除责任条款可能将以加粗字体形式显示，提示您注意，您应重点阅读。</b>
          </p>
          <p>派图租赁有权根据产品需要不定期地制定、修改本协议及/或各类规则，并在派图租赁平台内进行公示，不再另行单独通知您。如果您不同意修改后的协议或各类规则，您应立即停止使用本服务，继续使用本服务的视为您已经接受了修改后的协议内容。</p>
          <p>如果您违反本协议的任何约定，派图租赁有权依照本协议随时单方面限制、中止或终止向您提供本服务等措施，并有权追究您的相关经济及法律责任。</p>
          <h4>一、小程序订购方式</h4>
          <p>1、在您开通小程序功能之前，需满足以下条件：</p>
          <div class="long">
            <p>1.1 您需要成功注册成为派图租赁商家且需通过用户实名制的审核，方可订购小程序服务。</p>
            <p>
              1.2 您需要在腾讯旗下的微信公众平台
              <a>https://mp.weixin.qq.com</a> 先开通微信小程序账号。
            </p>
            <p>
              <b>1.3 小程序只支持企业法人用户以及个体工商户使用，不支持个人用户订购。</b>
            </p>
          </div>
          <h4>二、服务提供方</h4>
          <p>1、您知悉，派图租赁经您的合法授权通过与微信小程序技术接口对接的方式，从而帮您实现派图租赁店铺小程序的提交审核、发布代码功能。一经您的合法授权，派图租赁将会获取您在微信小程序中提交的头像、名称以及简介信息，用于您的店铺小程序展示使用。</p>
          <h4>三、服务条款</h4>
          <p>1、您了解，基于小程序通过腾讯微信平台使用，除遵守本协议外，还应遵守腾讯平台相关协议或规则，包括但不限于《腾讯服务协议》、《腾讯微信软件许可及服务协议》、《微信公众平台服务协议》、《微信小程序平台服务条款》等。</p>
          <p>2、您店铺的经营类目、上架的商品以及相关资质材料的提交应符合微信小程序相关规则，如因您的店铺不符合微信小程序相关规则导致小程序功能未能实现的，与派图租赁无关，派图租赁不承担任何责任。</p>
          <p>
            3、您同意并授权，派图租赁在您使用小程序服务时收集并留存您的相关交易数据。
            <b>授权后派图租赁将按照服务协议，不定期更新小程序的内容，包含但不限于代码和域名配置等，更新后会覆盖前授权历史数据，您需要获悉，授权后默认您同意变更。</b> 如您在使用本服务时违反本协议或派图租赁平台其他规则，派图租赁有权采取相应措施，包括但不限于下架或删除商品、停止向您继续提供服务等，并且已缴纳的费用不予退还。
          </p>
          <p>4、您应确保您的店铺经营行为符合派图租赁平台以及腾讯平台发布的相关协议或规则，因您违反上述规定导致本服务无法使用的，已缴纳的费用将不予退还。如因使用本服务给派图租赁或第三方造成损失的，您应承担全部赔偿责任。</p>
          <h4>四、服务费用</h4>
          <p>1、派图租赁向首次开通小程序的用户免费提供7天试用期，试用期结束后如继续使用本服务，则需缴纳一定服务使用费用，具体金额以及对应的使用期限以产品页面相关提示为准。缴费成功后不支持退款。如您申请开票，请致电派图租赁官方客服电话0756-3444514，派图租赁会将需要提交的资料以短信形式下发至您的手机中。</p>
          <p>2、您成功完成缴费后，该功能即可使用。</p>
          <p>3、本服务开通后，如您单方面原因停止使用该项服务的，您缴纳的费用不支持退还。如因派图租赁单方原因停止向您提供该项服务的，派图租赁将根据您实际使用时间折算一定比例金额将剩余金额退还您。</p>
          <p>4、出现下列任意情形的，派图租赁有权单方终止本协议：</p>
          <div class="long">
            <p>4.1服务到期且到期后未续费购买的；</p>
            <p>4.2您的店铺违反本协议或派图租赁平台规则的；</p>
            <p>4.3您在派图租赁的剩余规则分等于0分；</p>
            <p>4.4您违反腾讯公司相关协议或规定的。</p>
          </div>
          <h4>五、免责声明及有限保证</h4>
          <p>
            <b>1、您理解并同意，您必须为自己注册帐号下的一切行为负责，包括您所传送的任何内容以及由此产生的任何后果。您应对本服务中的内容自行加以判断，并承担因使用内容而引起的所有风险，包括因对内容的正确性、完整性或实用性的依赖而产生的风险。派图租赁无法且不会对因用户行为而导致的任何损失或损害承担责任。</b>
          </p>
          <p>
            <b>2、您理解并同意，本平台融合通信能力开放均基于运营商能力和资源，由于通信能力、系统、网络和资源的不确定性，派图租赁尽可能的维护能力的安全稳定，但对此不做任何保证；</b>
          </p>
          <p>
            <b>3、对于因不可抗力或派图租赁不能控制的原因造成的网络服务中断或其它缺陷，派图租赁不承担任何责任，但将尽力减少因此而给您造成的损失和影响。</b>
          </p>
          <p>
            <b>4、您理解并同意，因业务发展需要，派图租赁保留单方面对本服务的全部或部分服务内容变更、暂停、终止或撤销的权利，您需承担此风险。</b>
          </p>
          <p>
            <b>5. 派图租赁有权根据风险及自身业务运营情况需要，在您接受本服务的使用时，视为授权派图租赁单方面不经通知对小程序作出相应的修改及其他商家认为合理的处理。</b>
          </p>
          <p>
            <b>6.因用户使用本服务提交的相关数据，包括但不限于您在提交、操作中形成的数据及各类交易数据、您在使用微信小程序服务所形成的数据，在不损害您的合法权益的前提下，派图租赁有权进行收集、使用及修改等。</b>
          </p>
          <p>
            <b>7.您停用该服务或授权，或派图租赁终止向您提供本协议项下的服务后，派图租赁不再为您保留原账户中与之相关的任何信息；因此导致您无法使用服务或服务受到限制，派图租赁不构成违约，亦不承担任何法律责任。</b>
          </p>
          <h4>六、法律适用与争议解决</h4>
          <p>1、本协议之订立、生效、解释、变更、终止、执行与争议解决均适用中华人民共和国大陆地区法律；如无相关法律规定的，则应参照通用国际商业惯例及/或行业惯例。</p>
          <p>2、因本协议产生的一切争议应由您与派图租赁协商解决。协商解决不成的，您同意由派图租赁所在地人民法院诉讼解决。</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="showxy = false">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import appInfoDialog from "./components/appInfoDialog";
import validDatePicker from "./components/validDatePicker";
import { MiniAppOptCode, WxAppAuditStatus } from "@config/config";
import ApplyImg from "ServeComponents/untilsupload/applyimg";
import OneImgUpload from "ServeComponents/untilsupload";
import { ApplyMniApp, other } from "@/config/api";
import { rules, city, banklist } from "./components/Agreement";
import SdatePicker from "./components/datePicker";

export default {
  components: {
    ApplyImg,
    OneImgUpload,
    SdatePicker,
    appInfoDialog,
    validDatePicker
  },
  data: () => ({
    showxy:true,
    activePayGroupName: ["1", "2", "3", "4", "5"],
    appInfo: null,
    appInfoDialogVisable: false,
    SelfMiniAppOptCode: MiniAppOptCode,
    SelfWxAppAuditStatus: WxAppAuditStatus,
    loading: false,
    optStatus: 0,
    createMiniAppForm: {
      organization_type: 2,
      legal_persona_wechat: null,
      legal_persona_name: null,
      company_name: null,
      business_license_number: "",
      wx_app_id: null,
      mini_app_msg: "",
      mini_app_status: 0
    },
    setForm: {
      company_license_pic_qiniu: null,
      mini_app_name: null,
      info: null,
      name_audit_id: null,
      audit_version: null,
      audit_tpl_version: null,
      online_tpl_version: null,
      online_audit_id: null,
      online_version: null,
      last_tpl_version: null,
      mini_app_audit_id: null,
      mini_app_audit_status: null,
      mini_app_audit_msg: null,
      qr_code_url: null
    },
    payForm: {
      contact_phone: null,
      contact_email: null,
      id_card_number: null,
      id_card_copy_qiniu: null,
      id_card_national_qiniu: null,
      id_card_valid_time: null,

      service_phone: null,
      organization_number: null,
      organization_copy_qiniu: null,
      organization_time: null,

      bank_address_code: "",
      account_bank: "",
      bank_name: "",
      account_number: "",

      company_bank_address_code: "",
      company_account_bank: "",
      company_bank_name: "",
      company_account_number: ""
    },
    payStatusForm: {
      pay_applyment_id: "",
      pay_applyment_status: "",
      pay_applyment_msg: "",
      pay_applyment_msg_obj: [],
      pay_applyment_sign_url: "",
      pay_sub_mch_id: ""
    },
    organization_type_options: [
      {
        value: 2,
        label: "企业"
      },
      {
        value: 4,
        label: "个体户"
      }
    ],
    rules,
    banklist,
    banktimer: null,
    createMiniAppStatus: {
      init: 0,
      ing: 1,
      succ: 2,
      fail: 3,
      grant: 4
    },
    setDomainLoading: false,
    setWorkDomainLoading: false,
    setCategoryLoading: false,
    setNameLoading: false,
    queryNameLoading: false,
    setInfoLoading: false,
    setTplLoading: false,
    queryMiniAppInfoLoading: false,
    commitLoading: false,
    setIconLoading: false,
    createLoading: false,
    applyPayLoading: false,
    queryPayLoading: false,
    cityOptions: [],
    genQRLoading: false,
    activeProgress: "createMiniApp"
  }),

  created() {
    this.cityOptions = city(this);
    this.getRequest(ApplyMniApp.getApply)
      .then(res => {
        console.log(res);
        if (!this.util.isEmpty(res)) {
          //总表数据分几个FORM
          if (!this.util.isEmpty(res)) {
            this.setData(res);
          }
        }
      })
      .catch(err => {});
    if (
      this.createMiniAppForm.mini_app_status == this.createMiniAppStatus.succ
    ) {
      //如果创建状态成功
      this.activeProgress = "setMiniApp";
      //第三步支付配置没比较主动进去 支付成功一次 后面就不用配置了 常规操作都在第二步
    }
  },

  methods: {
    querySearchBankAsync(queryString, cb) {
      if (this.util.isEmpty(queryString) || queryString.length < 3) {
        cb([]);
      } else {
        this.getRequest("wx/searchBank", {
          search: queryString
        })
          .then(res => {
            if (res) {
              cb(res);
            }
          })
          .catch(err => {});
      }
    },
    //查询已经申请成功的小程序状态
    queryMiniAppInfo() {
      this.queryMiniAppInfoLoading = true;
      this.appInfoDialogVisable = true;
      this.getRequest(ApplyMniApp.queryMiniAppInfo)
        .then(res => {
          this.queryMiniAppInfoLoading = false;
          if (res) {
            if (res.errcode == 0) {
              this.appInfo = res;
              this.appInfoDialogVisable = true;
            }
          }
        })
        .catch(err => {
          this.queryMiniAppInfoLoading = false;
        });
    },
    setData(res) {
      this.optStatus = res.opt_status;
      this.createMiniAppForm.mini_app_status = parseInt(res.mini_app_status);
      this.createMiniAppForm.mini_app_msg = res.mini_app_msg;
      this.createMiniAppForm.business_license_number =
        res.business_license_number;
      this.createMiniAppForm.legal_persona_wechat = res.legal_persona_wechat;
      this.createMiniAppForm.legal_persona_name = res.legal_persona_name;
      this.createMiniAppForm.company_name = res.company_name;
      this.createMiniAppForm.organization_type = parseInt(
        res.organization_type
      );
      this.createMiniAppForm.wx_app_id = this.util.isEmpty(res.wx_app_id)
        ? null
        : res.wx_app_id;

      this.setForm.company_license_pic_qiniu = res.company_license_pic_qiniu;
      this.setForm.mini_app_icon_qiniu = res.mini_app_icon_qiniu;
      this.setForm.mini_app_name = res.mini_app_name;
      this.setForm.name_audit_id = res.name_audit_id;
      this.setForm.info = res.info;
      this.setForm.audit_version = this.util.isEmpty(res.audit_version)
        ? ""
        : res.audit_version; //用户自定义Version
      this.setForm.audit_tpl_version = res.audit_tpl_version; //用户提交tpl版本
      this.setForm.online_tpl_version = res.online_tpl_version; //线上tpl版本
      this.setForm.online_audit_id = res.online_audit_id; //审核ID
      this.setForm.online_version = res.online_version; //线上自定义版本
      this.setForm.last_tpl_version = res.last_tpl_version; //系统最新模板库
      this.setForm.mini_app_audit_id = res.mini_app_audit_id; //当前审核ID
      this.setForm.mini_app_audit_msg = res.mini_app_audit_msg; //当前审核消息
      this.setForm.mini_app_audit_status = res.mini_app_audit_status; //当前审核状态
      this.setForm.qr_code_url = res.qr_code_url; //小程序码

      this.payForm.contact_phone = res.contact_phone;
      this.payForm.contact_email = res.contact_email;
      this.payForm.id_card_number = res.id_card_number;
      this.payForm.id_card_copy_qiniu = res.id_card_copy_qiniu;
      this.payForm.id_card_national_qiniu = res.id_card_national_qiniu;
      this.payForm.id_card_valid_time = res.id_card_valid_time;
      this.payForm.service_phone = res.service_phone;
      this.payForm.organization_number = res.organization_number;
      this.payForm.organization_time = res.organization_time;
      this.payForm.organization_copy_qiniu = res.organization_copy_qiniu;

      this.payForm.bank_address_code = res.bank_address_code;
      this.payForm.account_bank = res.account_bank;
      this.payForm.bank_name = res.bank_name;
      this.payForm.account_number = res.account_number;

      this.payForm.company_bank_address_code = res.company_bank_address_code;
      this.payForm.company_account_bank = res.company_account_bank;
      this.payForm.company_bank_name = res.company_bank_name;
      this.payForm.company_account_number = res.company_account_number;

      this.payStatusForm.pay_applyment_id = res.pay_applyment_id;
      this.payStatusForm.pay_applyment_status = res.pay_applyment_status;
      this.payStatusForm.pay_applyment_sign_url = res.pay_applyment_sign_url;
      this.payStatusForm.pay_sub_mch_id = res.pay_sub_mch_id;
      this.payStatusForm.pay_applyment_msg = res.pay_applyment_msg;
      this.payStatusForm.pay_applyment_msg_obj = JSON.parse(
        this.util.isEmpty(res.pay_applyment_msg) ? "[]" : res.pay_applyment_msg
      );
    },
    //查询创建状态
    getCreateStatus() {
      this.getRequest(ApplyMniApp.getCreateStatus)
        .then(res => {
          this.setData(res);
        })
        .catch(err => {});
    },
    //创建小程序
    createMiniApp() {
      if (this.disableCreate) {
        this.$message.warning("已经创建过,不能重复创建");
        return;
      }
      this.$refs.createMiniAppForm.validate(valid => {
        if (valid) {
          this.createLoading = true;
          this.postRequest(ApplyMniApp.create, this.createMiniAppForm)
            .then(res => {
              if (res) {
                this.createLoading = false;
                if (res) {
                  this.setData(res);
                }
              }
            })
            .catch(err => {
              this.createLoading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    //申请支付
    applyPay() {
      if (
        this.payStatusForm.pay_applyment_status == "APPLYMENT_STATE_AUDITING"
      ) {
        this.$message.info("正在审核中");
        return;
      }
      if (
        this.payStatusForm.pay_applyment_status ==
          "APPLYMENT_STATE_TO_BE_CONFIRMED" ||
        this.payStatusForm.pay_applyment_status ==
          "APPLYMENT_STATE_TO_BE_SIGNED"
      ) {
        this.$message.info("请扫下面的二维码完成签约");
        return;
      }
      if (
        this.payStatusForm.pay_applyment_status == "APPLYMENT_STATE_SIGNING"
      ) {
        this.$message.info("系统开通相关权限中，请耐心等待");
        return;
      }
      if (
        this.payStatusForm.pay_applyment_status == "APPLYMENT_STATE_FINISHED"
      ) {
        this.$message.info("已完成,无需重复申请");
        return;
      }
      this.$refs.payForm.validate(valid => {
        if (valid) {
          this.applyPayLoading = true;
          this.postRequest(ApplyMniApp.applyPay, this.payForm)
            .then(res => {
              this.applyPayLoading = false;
              this.$message.info("申请成功,请耐心等待");
              this.queryPay();
            })
            .catch(err => {
              this.applyPayLoading = false;
            });
        } else {
          console.log("提交pay验证失败");
        }
      });
    },
    //查询支付申请状态
    queryPay() {
      this.queryPayLoading = true;
      this.getRequest(ApplyMniApp.queryPay)
        .then(res => {
          console.log(res);
          this.queryPayLoading = false;
          this.payStatusForm.pay_applyment_status = res.pay_applyment_status;
          this.payStatusForm.pay_applyment_sign_url =
            res.pay_applyment_sign_url;
          this.payStatusForm.pay_sub_mch_id = res.pay_sub_mch_id;
          this.payStatusForm.pay_applyment_msg = res.pay_applyment_msg;
          this.payStatusForm.pay_applyment_msg_obj = JSON.parse(
            res.pay_applyment_msg
          );
        })
        .catch(err => {
          this.queryPayLoading = false;
        });
    },
    // 搜索
    querySearch(queryString, cb) {
      console.log(queryString);
      if (!queryString || this.banktimer) return;
      this.banktimer = true;
      setTimeout(() => {
        this.getRequest(other.searchBank, {
          search: queryString
        })
          .then(res => {
            if (res) {
              let endarray = [];
              res.forEach(item => {
                endarray.push({
                  value: item.bank,
                  address: item.id
                });
              });
              console.log(endarray);
              cb(endarray);
              this.banktimer = false;
              if (res.length == 0)
                this.$message({
                  type: "warning",
                  message: "无结果，请检查输入是否正确"
                });
            }
          })
          .catch(err => {
            this.banktimer = false;
          });
      }, 800);
    },
    //设置服务器
    setDomain() {
      if ((MiniAppOptCode.WxOptSetDomain & this.optStatus) > 0) {
        this.$message.info("已经成功，无需重复设置");
        return;
      }
      this.postRequest(ApplyMniApp.setMiniAppDomain)
        .then(res => {
          if (res) {
            this.$message.info("设置成功");
          }
        })
        .catch(err => {});
    },
    //设置业务服务器
    setWorkDomain() {
      if ((MiniAppOptCode.WxOptSetWorkDomain & this.optStatus) > 0) {
        this.$message.info("已经成功，无需重复设置");
        return;
      }
      this.postRequest(ApplyMniApp.setMiniAppWorkDomain)
        .then(res => {
          if (res) {
            this.$message.info("设置成功");
          }
        })
        .catch(err => {});
    },
    //设置类目
    setCategory() {
      if ((MiniAppOptCode.WxOptSetCategory & this.optStatus) > 0) {
        this.$message.info("已经成功，无需重复设置");
        return;
      }
      this.postRequest(ApplyMniApp.setMiniAppCategory)
        .then(res => {
          if (res) {
            this.$message.info("设置类目成功");
          }
        })
        .catch(err => {});
    },
    //设置名称
    setName() {
      if (this.util.isEmpty(this.setForm.mini_app_name)) {
        this.$message.warning("名称不能为空");
        return;
      }
      if (this.util.isEmpty(this.setForm.company_license_pic_qiniu)) {
        this.$message.warning("名称依赖营业执照，请先上传营业执照");
        return;
      }
      this.postRequest(ApplyMniApp.setMiniAppName, {
        mini_app_name: this.setForm.mini_app_name
      })
        .then(res => {
          if (res) {
            this.optStatus = res.opt_status;
            this.setForm.name_audit_id = res.name_audit_id;
            this.$message.info(res.msg);
          }
        })
        .catch(err => {});
    },
    //查询小程序名字审核
    queryName() {
      if (
        this.setForm.name_audit_id == null ||
        this.setForm.name_audit_id.length == 0
      ) {
        this.$message.warning("没有审核ID");
        return;
      }
      this.queryNameLoading = true;
      this.postRequest(ApplyMniApp.queryNameAudit)
        .then(res => {
          this.queryNameLoading = false;
          if (res) {
            this.optStatus = res.opt_status;
            if (res.errcode == 0) {
              this.$message.info("成功");
              this.setForm.name_audit_id = "";
            } else {
              this.$message.error(res.fail_reason);
            }
          }
        })
        .catch(err => {
          this.queryNameLoading = false;
        });
    },
    //设置小程序描述
    setInfo() {
      if (this.util.isEmpty(this.setForm.mini_app_name)) {
        this.$message.warning("描述不能为空");
        return;
      }
      this.postRequest(ApplyMniApp.setMiniAppInfo, {
        info: this.setForm.info
      })
        .then(res => {
          if (res) {
            this.$message.info("设置描述成功");
            this.queryOptStatus();
          }
        })
        .catch(err => {
          this.queryOptStatus();
        });
    },
    //获取optStatus
    queryOptStatus() {
      this.postRequest(ApplyMniApp.queryOptStatus)
        .then(res => {
          if (res) {
            this.optStatus = res;
          }
        })
        .catch(err => {});
    },
    //设置模板
    setTpl() {
      if (this.util.isEmpty(this.setForm.audit_version)) {
        this.$message.warning("自定义版本号不能为空");
        return;
      }
      this.postRequest(ApplyMniApp.setMiniAppTpl, {
        audit_version: this.setForm.audit_version
      })
        .then(res => {
          if (res) {
            this.$message.info("设置成功");
            this.optStatus = res.opt_status;
          }
        })
        .catch(err => {});
    },
    //设置icon
    setIcon() {
      if (this.util.isEmpty(this.setForm.mini_app_icon_qiniu)) {
        this.$message.warning("ICON不能为空");
        return;
      }
      this.setIconLoading = true;
      this.postRequest(ApplyMniApp.setMiniAppIcon, {
        mini_app_icon_qiniu: this.setForm.mini_app_icon_qiniu
      })
        .then(res => {
          this.setIconLoading = false;
          if (res) {
            this.setIconLoading = false;
            this.$message.info("设置ICON成功");
            this.queryOptStatus();
          }
        })
        .catch(err => {
          this.queryOptStatus();
        });
    },
    //提交审核
    setCommit() {
      this.commitLoading = true;
      this.postRequest(ApplyMniApp.setMiniAppCommit)
        .then(res => {
          this.commitLoading = false;
          if (res) {
            //成功返回审核ID 改状态 清消息
            this.setForm.mini_app_audit_id = res;
            this.setForm.mini_app_audit_status =
              SelfWxAppAuditStatus.WxAppAuditStatusIng;
            this.setForm.mini_app_audit_msg = "";
          }
        })
        .catch(err => {
          this.commitLoading = false;
        });
    },
    //查询审核状态
    queryCommit() {
      this.commitLoading = true;
      this.postRequest(ApplyMniApp.queryLastAuditStatus)
        .then(res => {
          this.commitLoading = false;
          if (res) {
            this.setForm.mini_app_audit_id = res.mini_app_audit_id;
            this.setForm.mini_app_audit_status = res.mini_app_audit_status;
            this.setForm.mini_app_audit_msg = res.mini_app_audit_msg;
            this.optStatus = res.opt_status;
          }
        })
        .catch(err => {
          this.commitLoading = false;
        });
    },
    //手动发布 正常自动发布
    releaseCommit() {
      this.commitLoading = true;
      this.postRequest(ApplyMniApp.setMiniAppRelease)
        .then(res => {
          this.commitLoading = false;
          if (res) {
            this.setData(res);
          }
        })
        .catch(err => {
          this.commitLoading = false;
        });
    },
    //生成二维码
    genQR() {
      this.genQRLoading = true;
      this.getRequest(ApplyMniApp.genQR)
        .then(res => {
          this.genQRLoading = false;
          if (res) {
            this.setForm.qr_code_url =
              res + "?v=" + new Date(new Date().toLocaleDateString()).getTime();
          }
        })
        .catch(err => {
          this.genQRLoading = false;
        });
    }
  },
  computed: {
    disableCreate() {
      if (this.createMiniAppForm.wx_app_id == null) {
        return false;
      }
      return true;
    },
    isPersonal() {
      //是否个体户
      return this.createMiniAppForm.organization_type == 4;
    },
    isCorp() {
      //是否企业
      return this.createMiniAppForm.organization_type == 2;
    },
    needOrg() {
      //是否需要组织机构代码证
      if (this.createMiniAppForm.business_license_number) {
        return this.createMiniAppForm.business_license_number.length == 15;
      }
      return false;
    },
    isOtherBank() {
      return this.payForm.company_account_bank == "其他银行";
    }
  },
  filters: {
    miniAppStatusFilter(status, statusOption) {
      if (status == statusOption.init) {
        return "未创建";
      } else if (status == statusOption.ing) {
        return "创建中";
      } else if (status == statusOption.succ) {
        return "成功";
      } else if (status == statusOption.fail) {
        return "失败";
      }
    },
    optFilter(optStatus, targetOptStatus) {
      if ((targetOptStatus & optStatus) > 0) {
        return "成功";
      }
      return "未提交或失败";
    },
    auditStatusFilter(status, statusOption) {
      console.log("auditStatusFilter", status, statusOption);
      if (status == statusOption.WxAppAuditStatusSucc) {
        return "成功";
      } else if (status == statusOption.WxAppAuditStatusFail) {
        return "失败";
      } else if (status == statusOption.WxAppAuditStatusIng) {
        return "审核中";
      } else if (status == statusOption.WxAppAuditStatusCancel) {
        return "撤回";
      } else if (status == statusOption.WxAppAuditStatusInit) {
        return "未提交";
      }
      return "未知";
    },
    payApplymentStatusFilter(status) {
      if (status == "APPLYMENT_STATE_EDITTING") {
        return "编辑中：提交申请发生错误导致，请尝试重新提交。";
      } else if (status == "APPLYMENT_STATE_AUDITING") {
        return "审核中：申请单正在审核中，超级管理员用微信打开“签约链接”，完成绑定微信号后，申请单进度将通过微信公众号通知超级管理员，引导完成后续步骤。";
      } else if (status == "APPLYMENT_STATE_REJECTED") {
        return "已驳回：请按照驳回原因修改申请资料，超级管理员用微信打开“签约链接”，完成绑定微信号，后续申请单进度将通过微信公众号通知超级管理员。";
      } else if (status == "APPLYMENT_STATE_TO_BE_CONFIRMED") {
        return "待账户验证：请超级管理员使用微信打开返回的“签约链接”，根据页面指引完成账户验证。";
      } else if (status == "APPLYMENT_STATE_TO_BE_SIGNED") {
        return "待签约：请超级管理员使用微信打开返回的“签约链接”，根据页面指引完成账户验证。";
      } else if (status == "APPLYMENT_STATE_SIGNING") {
        return "开通权限中：系统开通相关权限中，请耐心等待。";
      } else if (status == "APPLYMENT_STATE_FINISHED") {
        return "已完成：商户入驻申请已完成。";
      } else if (status == "APPLYMENT_STATE_FINISHED") {
        return "已作废：申请单已被撤销。";
      }

      return "无";
    }
  }
};
</script>

<style lang="scss" scoped>
.form-box {
  background-color: #fff;
  padding: 36px;

  .bottom-button {
    margin-top: 2%;
    justify-content: center;
  }

  .bank-box {
    display: flex;

    .bankclass {
      width: 100%;
      margin-left: 20px;

      /deep/ .el-form-item__label {
        width: 220px !important;
      }

      /deep/ .el-autocomplete {
        width: 93%;
      }
    }
  }

  .company {
    display: flex;

    /deep/ .el-select {
      flex: 2;
      margin-right: 20px;
    }

    /deep/ .el-input {
      flex: 9;
    }
  }

  /deep/ .el-range-separator {
    padding: 0;
  }
}

.license-img {
  /deep/ .el-upload {
    width: 98px;
  }
}

.success {
  margin-top: 20px;
  text-align: center;

  .text {
    font-size: 16px;
    font-weight: bold;
    margin: 20px 0px;
  }
}

.el-autocomplete {
  width: 100%;
}

.el-cascader {
  width: 60%;
}
.img-box {
  margin-top: 20px;
  display: flex;
  justify-content: center;
}
.text-box {
  text-indent: 40px;
  line-height: 35px;
  height: 520px;
  overflow: auto;
  .long {
    text-indent: 60px;
  }
}
</style>
