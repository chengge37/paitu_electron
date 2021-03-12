// eslint-disable-next-line camelcase
// 城市列表
import { validatePhone, isEmptyForm, validateID, validatePhoneIncludeFixPhone } from '@/utils/validate.js'
export const city = (that) => {
  const provinces = that.$staticAllCityArray.map(item => {
    return item.province
  })
  let provincesArr = [...new Set(provinces)]
  provincesArr = provincesArr.map(item => {
    return {
      label: item,
      children: []
    }
  })
  const options = provincesArr.map(item => {
    that.$staticAllCityArray.forEach(city => {
      if (item.label === city.province) {
        item.children.push({
          label: city.city,
          value: city.admin_code
        })
      }
    })
    return item
  })
  return options
}
//
export const rules = {
  organization_type: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  mini_app_name: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  info: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  legal_persona_name: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    },
    { min: 2, max: 16, message: '长度在 2 到 16 个字符', trigger: 'blur' }
  ],
  legal_persona_wechat: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  id_card_name: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  company_name: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  contact_phone: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePhone
    }
  ],
  company_code_type: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  company_license_pic: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  company_license_pic_qiniu: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  organization_copy_qiniu: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  mini_app_icon_qiniu: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  business_licence_type: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  business_license_number: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    },
    {
      validator: (rule, value, callback) => {
        if (!value) {
          return callback(new Error('不能为空'))
        }
        setTimeout(() => {
          const regx = /^[A-Za-z0-9]+$/
          const isValidate = value.match(regx)

          if (!isValidate) {
            callback(new Error('请输入15位或者18位数字字母，不能是其他字符'))
          } else {
            if (value.length === 15 || value.length === 18) {
              callback()
            } else {
              callback(new Error('长度为15位或者18位，现在是' + value.length + '位'))
            }
          }
        }, 300)
      },
      trigger: 'blur'
    }

  ],
  company_address: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  business_time: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  organization_number: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  organization_time: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  id_card_number: [
    {
      required: true,
      trigger: 'blur',
      validator: validateID
    }
  ],
  id_card_valid_time: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  store_street: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  service_phone: [
    {
      required: true,
      trigger: 'blur',
      validator: validatePhoneIncludeFixPhone
    }
  ],
  store_address_code: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  bank_address_code: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  account_bank: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  bank_name: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  account_number: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  company_bank_address_code: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  company_account_bank: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  company_bank_name: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  company_account_number: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  contact_email: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  id_card_copy_qiniu: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  id_card_national_qiniu: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  store_entrance_pic_qiniu: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ],
  indoor_pic_qiniu: [
    {
      required: true,
      trigger: 'blur',
      validator: isEmptyForm
    }
  ]

}

export const banklist = [
  {
    id: 1,
    name: '工商银行'
  },
  {
    id: 2,
    name: '交通银行'
  },
  {
    id: 3,
    name: '招商银行'
  },
  {
    id: 4,
    name: '民生银行'
  },
  {
    id: 5,
    name: '中信银行'
  },
  {
    id: 6,
    name: '浦发银行'
  },
  {
    id: 7,
    name: '兴业银行'
  },
  {
    id: 8,
    name: '光大银行'
  },
  {
    id: 9,
    name: '广发银行'
  },
  {
    id: 10,
    name: '平安银行'
  },
  {
    id: 11,
    name: '北京银行'
  },
  {
    id: 12,
    name: '华夏银行'
  },
  {
    id: 13,
    name: '农业银行'
  },
  {
    id: 14,
    name: '建设银行'
  },
  {
    id: 15,
    name: '邮政储蓄银行'
  },
  {
    id: 16,
    name: '中国银行'
  },
  {
    id: 17,
    name: '宁波银行'
  },
  {
    id: 18,
    name: '其他银行'
  }
]

export const UnsupportedBank = [
  623501,
  621468,
  620522,
  625191,
  622384,
  623078,
  940034,
  622150,
  622151,
  622181,
  622188,
  955100,
  621095,
  620062,
  621285,
  621798,
  621799,
  621797,
  622199,
  621096,
  62215049,
  62215050,
  62215051,
  62218849,
  62218850,
  62218851,
  621622,
  623219,
  621674,
  623218,
  621599,
  623698,
  623699,
  623686,
  621098,
  620529,
  622180,
  622182,
  622187,
  622189,
  621582,
  623676,
  623677,
  622812,
  622810,
  622811,
  628310,
  625919,
  625368,
  625367,
  518905,
  622835,
  625603,
  625605,
  518905
]
