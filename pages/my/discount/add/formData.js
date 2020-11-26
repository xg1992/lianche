const formData = {
	name: {
		label: '名称',
		placeholder: '请输入优惠券名称'
	},
	type: {
		label: '类型',
		isRadio: true,
		options: [
			{title: '抵用券', value: 1},
			{title: '折扣券', value: 2}
		]
	},
	discountMoney: {
		isSwitch: true,
		type: 1,
		label: '优惠金额',
		isNumber: true,
		placeholder: '请输入优惠金额',
		unit: '元'
	},
	discount: {
		isSwitch: true,
		type: 2,
		label: '折扣',
		isNumber: true,
		placeholder: '请输入折扣',
		unit: '折'
	},
	rebateThreshold: {
		type: 'dikouquan',
		label: '使用门槛',
		isManjian: true,
		placeholder: '请输入金额'
	},
	circulation: {
		label: '发行总量',
		isNumber: true,
		placeholder: '应100~10000之间',
		unit: '个'
	},
	addCirculation: {
		label: '增发数量',
		isEdit: true,
		placeholder: '不能大于5000',
		unit: '个'
	},
	whoGet: {
		label: '领取人群',
		isRadio: true,
		options: [
			{title: '所有', value: 0},
			{title: '粉丝', value: 1},
			{title: '学员', value: 2}
		]
	},
	whoUse: {
		label: '使用人',
		isRadio: true,
		options: [
			{title: '不限', value: 0},
			{title: '仅限本人', value: 1}
		]
	},
	issueDate: {
		label: '领取时间',
		isDate: true,
		start: 'issueStartTime',
		end: 'issueEndTime',
	},
	useDate: {
		label: '使用时间',
		isDate: true,
		start: 'useStartTime',
		end: 'useEndTime',
	},
	instruction: {
		label: '使用说明',
		isTextarea: true,
		placeholder: '请填写使用说明'
	},
};
const rules = [
	{name: 'name', checkType: "string", checkRule:"1,12",  errorMsg:"名称应为1-12个字符"},
	{name: 'rebateThreshold', checkType: "reg", checkRule:"[0-9]*", errorMsg: '使用门槛不能为空'},
	{name: 'circulation', checkType: "betweenD", checkRule:"100,10000", errorMsg: '发行总量应在100-10000之间，并且为整数'},
	{name: 'issueStartTime', checkType: "notnull", retainSpace:true, errorMsg: '请设置领取开始时间'},
	{name: 'issueEndTime', checkType: "notnull", retainSpace:true, errorMsg: '请设置领取结束时间'},
	{name: 'useStartTime', checkType: "notnull", retainSpace:true, errorMsg: '请设置使用开始时间'},
	{name: 'useEndTime', checkType: "notnull", retainSpace:true, errorMsg: '请设置使用结束时间'},
	{name: 'instruction', checkType: "string", checkRule:"10,32", retainSpace:true, errorMsg: '使用说明字数在10到32之间'},
];
module.exports = {formData,rules};