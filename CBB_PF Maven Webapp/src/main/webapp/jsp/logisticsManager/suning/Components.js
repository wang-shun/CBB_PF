﻿Ext.namespace("Ext.ux.suning");
Ext.ux.suning.LogisticsGridPanel = Ext.extend(Ext.grid.GridPanel, {
	stripeRows : true, // 交替行效果
	loadMask : true,
	pageSize : myPageSize,
	readOnly : false,

	showColumns : [ 
//        "LOGISTICS_ID",
	     "GUID",
	     "ORDER_NO",
	     "CUSTOM_CODE",
//	     "APP_TYPE",
	     "APP_TIME",
	     "APP_STATUS",
//	     "APP_UID",
	     "EBP_CODE",
//	     "LOGISTICS_ORDER_ID",
	     "LOGISTICS_CODE",
	     "LOGISTICS_NO",
	     "LOGISTICS_STATUS",
//	     "IE_FLAG",
//	     "TRAF_MODE",
//	     "SHIP_NAME",
//	     "VOYAGE_NO",
//	     "BILL_NO",
//	     "FREIGHT",
//	     "INSURE_FEE",
//	     "CURRENCY",
//	     "WEIGHT",
//	     "NET_WEIGHT",
//	     "PACK_NO",
//	     "PARCEL_INFO",
	     "GOODS_INFO",
	     "CONSIGNEE",
//	     "CONSIGNEE_ADDRESS",
//	     "CONSIGNEE_TELEPHONE",
	     "CONSIGNEE_COUNTRY",
	     "SHIPPER",
//	     "SHIPPER_ADDRESS",
//	     "SHIPPER_TELEPHONE",
	     "SHIPPER_COUNTRY",
	     "NOTE",
	     "RETURN_STATUS",
	     "RETURN_TIME",
	     "RETURN_INFO"/*,
	     "CREAT_TIME",
	     "UPDATE_TIME"*/],
	checkSelect : function(single,preventMask){
		var records=this.getSelectionModel().getSelections();
		var data=false;
		if(Ext.isEmpty(records)||records.length<1){
			if(preventMask!=true)Ext.Msg.alert("提示", '请选择一条记录');
		}else if(single){
			if(records.length>1){
				if(preventMask!=true)Ext.Msg.alert("提示", '只能选择一条记录');
			}else{
				data=records[0];
			}
		}else{
			data=records;
		}
		return data;
	},
	edit : function (title,param){
		var infoPanel=null;
		//+title;
		if(param.editType=="add"){
			title="苏宁物流录入";
			infoPanel=new Ext.ux.suning.LogisticsPanel(param);
		}else{
			title="苏宁物流信息";
			infoPanel=new Ext.ux.suning.LogisticsFormPanel(param);
		}
		var tabPage=top.addTabPage(infoPanel,title,"",false);
		infoPanel.on("close",function(){
			top.closeTab(tabPage);
			if(!this.isDestroyed){
				var pageTool = this.pageTool;
				if (pageTool) {
					pageTool.doLoad(pageTool.cursor);
				}
			}
		},this);
	},
	reload: function(){
		var pageTool = this.pageTool;
		if (pageTool) {
			pageTool.doLoad(pageTool.cursor);
		}
	},
	del : function (record){
//		if(isOrderReadOnly(record)){
			var param={
				LOGISTICS_ID:record.get("LOGISTICS_ID"),
				LOGISTICS_NO:record.get("LOGISTICS_NO")
			};
			this.getEl().mask("执行中...");
			Ext.Ajax.request({
				scope: this,
				url : 'suning!delLogistics.action',
				method : "POST",
				params : param,
				success : function(response) {
					this.getEl().unmask();
					var obj = Ext.decode(response.responseText);
					if (obj.returnResult == 0) {
						Ext.Msg.alert("信息", obj.returnMessage, this.reload, this);
					}else{
						this.reload();
					}
				},
				error : function(response) {
					this.getEl().unmask();
					Ext.Msg.alert("异常", response.responseText);
				},
				failure : function(response) {
					this.getEl().unmask();
					Ext.Msg.alert("异常", response.responseText);
				}
			});
//		}
	},
	isLogStatusValid: function(record,newLogStatus,preventMask){
		var oldLogStatus=record.get('LOGISTICS_STATUS');
		var returnStatus=record.get('RETURN_STATUS');
		if(oldLogStatus==newLogStatus&&returnStatus==120){
			if(preventMask!=true){
				Ext.Msg.alert("错误", "此状态已完成，请勿再次提交！");
			}
			return false;
		}
		return true;
	},
	setLogStatus : function (record,newLogStatus){
		if(!this.isLogStatusValid(record,newLogStatus)) return false;
//		if(isOrderReadOnly(record)){
			var param={
				'editType': "modStatus",
				'LOGISTICS_STATUS':newLogStatus,
				'LOGISTICS_ID':record.get("LOGISTICS_ID"),
				'LOGISTICS_NO':record.get("LOGISTICS_NO"),
				'GUID':record.get("GUID")
			};
			this.getEl().mask("执行中...");
			Ext.Ajax.request({
				scope: this,
				url : 'suning!setLogistics.action',
				method : "POST",
				params : param,
				success : function(response) {
					this.getEl().unmask();
					var obj = Ext.decode(response.responseText);
					if (obj.returnResult == 0) {
						Ext.Msg.alert("信息", obj.returnMessage, this.reload, this);
					}else{
						this.reload();
					}
				},
				error : function(response) {
					this.getEl().unmask();
					Ext.Msg.alert("异常", response.responseText);
				},
				failure : function(response) {
					this.getEl().unmask();
					Ext.Msg.alert("异常", response.responseText);
				}
			});
//		}
	},
	initComponent : function () {
		this.sm= new Ext.grid.RowSelectionModel({singleSelect:true});
		var store = new Ext.data.Store(Ext.apply({
			url : 'suning!getAllLogisticses.action',
			reader : new Ext.data.JsonReader({
				totalProperty : 'total',
				root : "rows"
			}, [ "LOGISTICS_ID",
			     "GUID",
			     "ORDER_NO",
			     "CUSTOM_CODE",
			     "APP_TYPE",
			     "APP_TIME",
			     "APP_STATUS",
			     "APP_UID",
			     "EBP_CODE",
			     "LOGISTICS_ORDER_ID",
			     "LOGISTICS_CODE",
			     "LOGISTICS_NO",
			     "LOGISTICS_STATUS",
			     "IE_FLAG",
			     "TRAF_MODE",
			     "SHIP_NAME",
			     "VOYAGE_NO",
			     "BILL_NO",
			     "FREIGHT",
			     "INSURE_FEE",
			     "CURRENCY",
			     "WEIGHT",
			     "NET_WEIGHT",
			     "PACK_NO",
			     "PARCEL_INFO",
			     "GOODS_INFO",
			     "CONSIGNEE",
			     "CONSIGNEE_ADDRESS",
			     "CONSIGNEE_TELEPHONE",
			     "CONSIGNEE_COUNTRY",
			     "SHIPPER",
			     "SHIPPER_ADDRESS",
			     "SHIPPER_TELEPHONE",
			     "SHIPPER_COUNTRY",
			     "NOTE",
			     "RETURN_STATUS",
			     "RETURN_TIME",
			     "RETURN_INFO",
			     "CREAT_TIME",
			     "UPDATE_TIME",
			     "EBC_CODE",
			     "AGENT_CODE",
			     "GOODSList",
			     "CONSIGNEE_COUNTRY_O"]),
			listeners:{
			  	"exception": function(proxy,type,action,options,response,arg){
			  		Ext.Msg.alert("提示","加载出错"+
						"<BR>Status:"+response.statusText||"unknow");
			  	}
			}
		},this.storeCfg));
		if(Ext.isEmpty(this.columns)){
			this.columns= [ new Ext.grid.RowNumberer({
				width : 26
			}), {
			    id : "LOGISTICS_ID",
			    header : "",
			    dataIndex : "LOGISTICS_ID",
			    hidden : true,
			    hideable : false
			}, {
			    id : "LOGISTICS_ORDER_ID",
			    header : "LOGISTICS_ORDER_ID",
			    dataIndex : "LOGISTICS_ORDER_ID",
			    hidden : true,
			    hideable : false
			},{
			    id : "GUID",
			    header : "系统唯一序号",
			    dataIndex : "GUID",
			    width : 320
			},{
			    id : "ORDER_NO",
			    header : "订单编号",
			    dataIndex : "ORDER_NO"
			},new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_custom,
			    id : "CUSTOM_CODE",
			    header : "主管海关代码",
			    dataIndex : "CUSTOM_CODE"
			}),{
			    id : "APP_TYPE",
			    header : "申报类型",
			    dataIndex : "APP_TYPE",
			    renderer: Renderer.APP_TYPE
			},{
			    id : "APP_TIME",
			    header : "申报时间",
			    dataIndex : "APP_TIME",
			    width : 140
			},{
			    id : "APP_STATUS",
			    header : "业务状态",
			    dataIndex : "APP_STATUS",
			    renderer: Renderer.APP_STATUS
			},{
			    id : "LOGISTICS_STATUS",
			    header : "物流运单状态",
			    dataIndex : "LOGISTICS_STATUS",
		    	renderer: Renderer.LOG_STATUS
			},new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_appUid,
			    id : "APP_UID",
			    header : "用户",
			    dataIndex : "APP_UID"
			}),new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_ebp,
			    id : "EBP_CODE",
			    header : "电商平台",
			    dataIndex : "EBP_CODE"
			}),new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_logistics,
			    id : "LOGISTICS_CODE",
			    header : "物流企业",
			    dataIndex : "LOGISTICS_CODE"
			}),{
			    id : "LOGISTICS_NO",
			    header : "物流运单编号",
			    dataIndex : "LOGISTICS_NO"
			},new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_ieFlag,
			    id : "IE_FLAG",
			    header : "进出口标记",
			    dataIndex : "IE_FLAG"
			}),new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_trafMode,
			    id : "TRAF_MODE",
			    header : "运输方式",
			    dataIndex : "TRAF_MODE"
			}),{
			    id : "SHIP_NAME",
			    header : "运输工具名称",
			    dataIndex : "SHIP_NAME"
			},{
			    id : "VOYAGE_NO",
			    header : "航班航次号",
			    dataIndex : "VOYAGE_NO"
			},{
			    id : "BILL_NO",
			    header : "提运单号",
			    dataIndex : "BILL_NO"
			},{
			    id : "FREIGHT",
			    header : "订单商品运费",
			    dataIndex : "FREIGHT"
			},{
			    id : "INSURE_FEE",
			    header : "保价费",
			    dataIndex : "INSURE_FEE"
			},new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_currency,
			    id : "CURRENCY",
			    header : "币制",
			    dataIndex : "CURRENCY"
			}),{
			    id : "WEIGHT",
			    header : "毛重",
			    dataIndex : "WEIGHT"
			},{
			    id : "NET_WEIGHT",
			    header : "净重",
			    dataIndex : "NET_WEIGHT"
			},{
			    id : "PACK_NO",
			    header : "件数",
			    dataIndex : "PACK_NO"
			},{
			    id : "PARCEL_INFO",
			    header : "包裹单信息",
			    dataIndex : "PARCEL_INFO"
			},{
			    id : "GOODS_INFO",
			    header : "商品信息",
			    dataIndex : "GOODS_INFO"
			},{
			    id : "CONSIGNEE",
			    header : "收货人名称",
			    dataIndex : "CONSIGNEE"
			},{
			    id : "CONSIGNEE_ADDRESS",
			    header : "收货人地址",
			    dataIndex : "CONSIGNEE_ADDRESS"
			},{
			    id : "CONSIGNEE_TELEPHONE",
			    header : "收货人电话",
			    dataIndex : "CONSIGNEE_TELEPHONE"
			},new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_country,
				id : "CONSIGNEE_COUNTRY",
			    header : "收货人所在国",
			    dataIndex : "CONSIGNEE_COUNTRY",
			    valueField: "SN_CODE"
			}),{
			    id : "SHIPPER",
			    header : "发货人名称",
			    dataIndex : "SHIPPER"
			},{
			    id : "SHIPPER_ADDRESS",
			    header : "发货人地址",
			    dataIndex : "SHIPPER_ADDRESS"
			},{
			    id : "SHIPPER_TELEPHONE",
			    header : "发货人电话",
			    dataIndex : "SHIPPER_TELEPHONE"
			},new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_country,
				id : "SHIPPER_COUNTRY",
			    header : "发货人所在国",
			    dataIndex : "SHIPPER_COUNTRY",
			    valueField: "SN_CODE"
			}),{
			    id : "NOTE",
			    header : "备注",
			    dataIndex : "NOTE"
			},{
			    id : "RETURN_STATUS",
			    header : "回执状态",
			    dataIndex : "RETURN_STATUS",
			    renderer: Renderer.RETURN_STATUS
			},{
			    id : "RETURN_TIME",
			    header : "回执时间",
			    dataIndex : "RETURN_TIME",
			    width : 140
			},{
			    id : "RETURN_INFO",
			    header : "回执信息",
			    dataIndex : "RETURN_INFO"
			},{
			    id : "CREAT_TIME",
			    header : "",
			    dataIndex : "CREAT_TIME",
			    hidden : true,
			    hideable : false
			},{
			    id : "UPDATE_TIME",
			    header : "",
			    dataIndex : "UPDATE_TIME",
			    hidden : true,
			    hideable : false
			}];
		}
		Ext.each(this.columns,function(item,index,allItems){
			if(item['dataIndex']){
				var idx=findIndexByProperty(this.showColumns,null,item['dataIndex']);
				item['hidden']=idx<0;
				item['hideable']=!item['hidden'];
			}
			if(Ext.isEmpty(item['width'])&&!Ext.isEmpty(item['header'])){
				item['width']=item['header'].length*20;
			}
			function extendRenderer(val,metadata,record,row,col,store,renderer){
				var data=val;
				if(!Ext.isEmpty(renderer)&&Ext.isFunction(renderer)){
					data=renderer(val,metadata,record,row,col,store);
				}
				if(!Ext.isEmpty(data))
					metadata.attr = 'ext:qtip="' +data+'"';   //关键  
				return data;
			}
			item['renderer']=extendRenderer.createDelegate(undefined,[item['renderer']],6);
		},this);
		var cm = new Ext.grid.ColumnModel({
			defaults : {
				sortable : true
			},
			columns : this.columns
		});
		
        if(Ext.isEmpty(this.store)&&Ext.isEmpty(this.ds)){
            this.store = store;
        }
        if(Ext.isEmpty(this.cm)&&Ext.isEmpty(this.colModel)){
            this.colModel = cm;
        }
        /*if(Ext.isEmpty(this.selModel)&&Ext.isEmpty(this.sm)){
            this.selModel = selModel;
        }*/
        
        if(Ext.isEmpty(this.bbar)&&this.mode!=="local"){
			var bbar = new Ext.PagingToolbar({
				pageSize : this.pageSize,// 每页显示的记录值
				store : this.store,
				displayInfo : true,
				displayMsg : '当前 {0} - {1} ，总数 {2}',
				emptyMsg : "没有记录"
			});
			bbar.doRefresh();
			this.pageTool=bbar;
			this.bbar = bbar;
        }
        
        if(Ext.isEmpty(this.tbar)&&this.tbar!=false){
			var tbar = new Ext.Toolbar({items:[/*{
			        text: '查询',
			        icon:'../../resource/images/btnImages/search.png',
			        handler: function(){
		
					}.createDelegate(this)
				},'-',*/{
					text:'新增',
					scale: 'medium',
					icon:'../../resource/images/btnImages/add.png',
					handler: function(b,e){
						var editType='add';
						this.edit('录入',{editType:editType});
					}.createDelegate(this)
				},{
			        text: '编辑',
			        scale: 'medium',
			        icon:'../../resource/images/btnImages/modify.png',
			        handler: function(b,e){
			        	var editType='mod';
			        	var data=this.checkSelect(true);
			        	if(data)
			        		this.edit('编辑',{editType:editType,record:data});
					}.createDelegate(this)
				},{
			        text: '删除',
			        scale: 'medium',
			        name: 'delete',
			        disabled: true,
			        icon:'../../resource/images/btnImages/delete.png',
			        handler: function(){
			        	var data=this.checkSelect(true);
			        	if(data)
			        		this.del(data);
			        }.createDelegate(this)
				},{
			        text: '状态设置',
			        scale: 'medium',
			        name: 'setStatus',
			        disabled: true,
			        icon:'../../resource/images/btnImages/modify.png',
			        menu: (function(){
			        		var menu=[];
			        		Ext.each(TextValue.LOG_STATUS,function(item,index,allItems){
			        			menu.push({
			        				text:item['text'],
			        				value:item['value'],
			        				handler: function(b){
		        			        	var data=this.checkSelect(true);
			        			        if(data)
			        			        	this.setLogStatus(data,b.value);
			        			        
			        				}.createDelegate(this)
			        			});
			        		},this);
			        		return menu;
			        	}.createDelegate(this))()
				}/*,{
			        text: '复制',
			        icon:'../../resource/images/btnImages/page_copy.png',
			        handler: function(b,e){
			        	var editType='add';
			        	var data=this.checkSelect(true);
			        	if(data)
			        		this.edit('录入',{editType:editType,record:data});
					}.createDelegate(this)
				}*/]
			});
			if(this.readOnly){
				tbar.remove(3);
				tbar.remove(2);
				tbar.get(1).setText("运单信息");
				tbar.remove(0);
			}else if(this.mode=="local"){
				tbar.remove(3);
				tbar.get(1).setText("运单信息");
				tbar.remove(0);
			}
			this.tbar = tbar;
        }
		this.on('rowclick', function(grid, rowIndex, e) {
	        var selections = grid.getSelectionModel().getSelections();
	        if (selections.length == 0) return;
			var button=this.topToolbar.find("name",'delete')[0];
			if(button){
		        for ( var i = 0; i < selections.length; i++) {
		            var record = selections[i];
		            button.setDisabled(isLogisticsReadOnly(record));
		        }
			}
			button=this.topToolbar.find("name",'setStatus')[0];
			if(button){
		        for ( var i = 0; i < selections.length; i++) {
		            var record = selections[i];
		            button.setDisabled(isLogisticsStatusReadOnly(record));
		            /*button.menu.items.each(function(item,index,length){
		            	item.setDisabled(isLogisticsStatusReadOnly(record));
		            },this);*/
		        }
			}
			
	    },this);
		
		Ext.ux.suning.LogisticsGridPanel.superclass.initComponent.call(this);
	}
});

Ext.ux.suning.LogisticsFormPanel = Ext.extend(Ext.form.FormPanel, {
	record : undefined,
	editType : 'add',
	readOnly: undefined,
	
	autoScroll : true,
	defaults : {
		xtype: 'textfield',
        allowBlank : false,
        anchor : "100%",
        maxLength: 250
	},
	bodyStyle:'padding:10px 10px 10px 10px',
	labelWidth: 130,
	monitorValid: true,

	setRecord : function(record){
		this.record = record;
		this.renderRecord();
	},
	renderRecord : function(){
		if(this.record){
			this.getForm().loadRecord(this.record);
		}
	},
	isReadOnly: function(){
		if(this.editType=="add") return false;
		if(this.record){
			return isLogisticsReadOnly(this.record);
		}
		return false;
	},
	submitForm : function(opType){
		var fp=this;
		var form = fp.getForm();
		if (form.isValid()) {
			var param={
		        editType: this.editType,
		        APP_STATUS: opType
		    };
			//添加displayfield参数或未显示参数
			if(this.editType=="mod"){
				Ext.apply(param,{
			        GUID: this.record.get('GUID'),
	//		        APP_TIME: this.record.get('APP_TIME'),
			        LOGISTICS_ID: this.record.get('LOGISTICS_ID')
				});
			}
			form.submit({
				scope:fp,
			    clientValidation: true,
			    waitTitle: '正在执行',
			    waitMsg: '请稍后……',
			    url: 'suning!setLogistics.action',
			    params: param,
			    success: function(form, action) {
			    	if(!Ext.isEmpty(action.result.msg)){
			    		Ext.Msg.alert('成功', action.result.msg, 
			    		function(){
			    			this.fireEvent('close',this);
			    		}, this);
			    	}else{
			    		this.fireEvent('close',this);
			    	}
			    },
			    failure: function(form, action) {
			        switch (action.failureType) {
			            case Ext.form.Action.CLIENT_INVALID:
			                Ext.Msg.alert('失败', '表单项存在非法值');
			                break;
			            case Ext.form.Action.CONNECT_FAILURE:
			                Ext.Msg.alert('失败', '与服务器通信异常');
			                break;
			            case Ext.form.Action.SERVER_INVALID:
			               Ext.Msg.alert('失败', action.result.msg);
			       }
			    }
			});
		}
	},
	initComponent : function () {
		if(this.readOnly==undefined)
			this.readOnly=this.isReadOnly();
		this.submited=!(Ext.isEmpty(this.record)||this.record.get("APP_STATUS")==1);
		this.items=[
//		{xtype:'hidden',name:"LOGISTICS_ID"},
		{
			xtype:'displayfield',
			name:"GUID",
			fieldLabel:'系统唯一序号',
			hidden: this.editType=="add"
		},{
	        fieldLabel:'订单编号',
	        name: 'ORDER_NO',
	        readOnly: true,
	        maxLength: 30
		},GenerateCodeNameComboGrid({
	    		allowBlank : false,
		    	fieldLabel:'主管海关代码',
		    	name: 'CUSTOM_CODE'
	        },relationCategory_custom
	    ),{
			xtype:'displayfield',
	        fieldLabel:'申报时间',
	        name: 'APP_TIME',
	        hidden: !this.submited
	    },GenerateCodeNameComboGrid({
	    		allowBlank : false,
		    	fieldLabel:'用户名称',
		    	name: 'APP_UID'
	        },relationCategory_appUid
	    ),GenerateCodeNameComboGrid({
	    		allowBlank : false,
		    	fieldLabel:'电商平台名称',
		    	name: 'EBP_CODE'
	        },relationCategory_ebp
	    ),GenerateCodeNameComboGrid({
	    		allowBlank : false,
		    	fieldLabel:'物流企业名称',
		    	name: 'LOGISTICS_CODE'
	        },relationCategory_logistics
	    ),{
	        fieldLabel:'物流运单编号',
	        name: 'LOGISTICS_NO',
//	        readOnly: this.editType!=="add",
	        maxLength: 20
		},GenerateCodeNameComboGrid({
	    		allowBlank : false,
		    	fieldLabel:'进出口标记',
		    	name: 'IE_FLAG',
		    	autoLoad: false
	        },relationCategory_ieFlag,CodeNameData.ieFlag
	    ),GenerateCodeNameComboGrid({
	    		allowBlank : false,
		    	fieldLabel:'运输方式',
		    	name: 'TRAF_MODE'
	        },relationCategory_trafMode
	    ),{
	        fieldLabel:'运输工具名称',
	        name: 'SHIP_NAME',
	        maxLength: 100
		},{
	        fieldLabel:'航班航次号',
	        name: 'VOYAGE_NO',
	        maxLength: 32
		},{
	        fieldLabel:'提运单号',
	        name: 'BILL_NO',
	        maxLength: 37
		},{
	    	xtype:'numberfield',
	    	allowNegative: false,
	        fieldLabel:'运费',
	        name: 'FREIGHT'
	    },{
	    	xtype:'numberfield',
	    	allowNegative: false,
	        fieldLabel:'保价费',
	        name: 'INSURE_FEE'
	    },GenerateCodeNameComboGrid({
	    	fieldLabel:'币制',
	    	name: 'CURRENCY',
	        allowBlank : false
        	},relationCategory_currency
	    ),{
	    	xtype:'numberfield',
	    	allowNegative: false,
	    	readOnly: true,
	        fieldLabel:'毛重',
	        name: 'WEIGHT'
	    },{
	    	xtype:'numberfield',
	    	allowNegative: false,
	    	readOnly: true,
	        fieldLabel:'净重',
	        name: 'NET_WEIGHT'
	    },{
	    	xtype:'numberfield',
	    	allowNegative: false,
	    	allowDecimals: false,
	    	readOnly: true,
	        fieldLabel:'件数',
	        name: 'PACK_NO'
	    },{
	        fieldLabel:'包裹单信息',
	        name: 'PARCEL_INFO',
	        maxLength: 200
		},{
	    	readOnly: true,
	        fieldLabel:'商品信息',
	        name: 'GOODS_INFO',
	        maxLength: 200
		},{
	    	readOnly: true,
	        fieldLabel:'收货人名称',
	        name: 'CONSIGNEE',
	        maxLength: 100
	    },{
	    	readOnly: true,
	        fieldLabel:'收货人地址',
	        name: 'CONSIGNEE_ADDRESS',
	        maxLength: 200
	    },{
	    	readOnly: true,
	        fieldLabel:'收货人电话',
	        name: 'CONSIGNEE_TELEPHONE',
	        maxLength: 50
	    },GenerateCodeNameComboGrid({
		    	fieldLabel:'收货人所在国',
		    	name: 'CONSIGNEE_COUNTRY',
		        valueField: "SN_CODE",
		        allowBlank : false,
		        readOnly: this.readOnly
        	},relationCategory_country
	    ),{
	    	readOnly: true,
	        fieldLabel:'发货人名称',
	        name: 'SHIPPER',
	        maxLength: 100
	    },{
	    	readOnly: true,
	        fieldLabel:'发货人地址',
	        name: 'SHIPPER_ADDRESS',
	        maxLength: 200
	    },{
	    	readOnly: true,
	        fieldLabel:'发货人电话',
	        name: 'SHIPPER_TELEPHONE',
	        maxLength: 50
	    },GenerateCodeNameComboGrid({
		    	fieldLabel:'发货人所在国',
		    	name: 'SHIPPER_COUNTRY',
		        valueField: "SN_CODE",
		        allowBlank : false,
		        readOnly: this.readOnly
        	},relationCategory_country
	    ),{
	        xtype: 'textarea',
	        readOnly: true,
	        fieldLabel:'备注',
	        name: 'NOTE',
	        maxLength: 1000
	    }];

		var columns=[];
		var hiddens=[];
		Ext.apply(this.defaults,{readOnly:this.readOnly});
		Ext.each(this.items,function(item,index,allItems){
			if(!item.hidden){
				if(columns.length==0||columns[columns.length-1].items==undefined||columns[columns.length-1].items.length==2){
					columns.push({
						layout:'column',
						border:false,
						defaults:{columnWidth: .4},
						items:[]
					});
				}
				var bodyStyle;
				if(columns[columns.length-1].items.length==0)
					bodyStyle='padding:0px 10px 0px 0px';
				else
					bodyStyle='padding:0px 0px 0px 10px';
				columns[columns.length-1].items.push({
					layout:'form',
					border:false,
					bodyStyle:bodyStyle,
					defaults: this.defaults,
					items:[item]
				});
			}
		},this);
		Ext.each(this.items,function(item,index,allItems){
			if(item.hidden){
				columns.push(item);
			}
		},this);
		this.defaults=undefined;
		this.items=columns;
		
		var validateButton=function (){
			if(this.buttons==undefined)
				this.buttons=[];
			if(!this.readOnly){
				this.buttons.push(new Ext.Button({
					disabled: true,
					formBind: true,
			    	text : '保存', 
			    	scale: 'large',
			    	icon : '../../resource/images/btnImages/save.png',
					handler : function(b,e){
						Ext.apply(this.baseParams,{opType:'save'});
						this.submitForm(1);
			    	}.createDelegate(this)
			    }),new Ext.Button({
			    	disabled: true,
			    	formBind: true,
			    	text : '提交', 
			    	scale: 'large',
			    	icon : '../../resource/images/btnImages/accept.png',
					handler : function(b,e){
						Ext.apply(this.baseParams,{opType:'submit'});
						this.submitForm(2);
			    	}.createDelegate(this)
			    }));
			}
			this.buttons.push(new Ext.Button({
		    	text : '取消', 
		    	scale: 'medium',
		    	icon : '../../resource/images/btnImages/cancel.png',
				handler : function(b,e){
					this.fireEvent('close',this);
		    	}.createDelegate(this)
		    }));
		}.createDelegate(this);

		validateButton();
		
		this.addEvents('close');
		this.enableBubble('close');

		Ext.ux.suning.LogisticsFormPanel.superclass.initComponent.call(this);
		this.renderRecord();
	}
});

Ext.ux.suning.TaskQueryGridPanel = Ext.extend(Ext.grid.GridPanel, {
	stripeRows : true, // 交替行效果
	loadMask : true,
	pageSize : myPageSize,
	readOnly : false,
	mode : "remote",

	showColumns : [ 
//	    "LOGISTICS_ORDER_ID",
	    "ORDER_NO",
	    "WEIGHT",
	    "NET_WEIGHT",
	    "PACK_NO",
	    "GOODS_INFO",
	    "CONSIGNEE",
	    "CONSIGNEE_ADDRESS",
	    "CONSIGNEE_TELEPHONE",
	    "CONSIGNEE_COUNTRY",
	    "SHIPPER",
	    "SHIPPER_ADDRESS",
	    "SHIPPER_TELEPHONE",
	    "SHIPPER_COUNTRY",
	    "NOTE"],
	checkSelect : function(single,preventMask){
		var records=this.getSelectionModel().getSelections();
		var data=false;
		if(Ext.isEmpty(records)||records.length<1){
			if(preventMask!=true)Ext.Msg.alert("提示", '请选择一条记录');
		}else if(single){
			if(records.length>1){
				if(preventMask!=true)Ext.Msg.alert("提示", '只能选择一条记录');
			}else{
				data=records[0];
			}
		}else{
			data=records;
		}
		return data;
	},
	query : function (param){
		var startTime=this.topToolbar.find("name",'startTime')[0].getValue();
		var endTime=this.topToolbar.find("name",'endTime')[0].getValue();
		if(Ext.isEmpty(startTime)||Ext.isEmpty(endTime)){
			Ext.Msg.alert("提示", '开始/结束时间不能为空。');
			return;
		}
		if(startTime>endTime){
			Ext.Msg.alert("提示", '开始时间不能晚于结束时间。');
			return;
		}
		this.store.baseParams={
			'startTime':startTime,
			'endTime':endTime,
			'limit': this.pageSize
		};
		this.store.load();
	},
	del : function (records){
		if(!Ext.isArray(records)){
			records=[records];
		}
		for(var i=0;i<records.length;i++){
			var record=records[i];
			this.getStore().remove(record);
		}
		this.getView().refresh();
	},
	reload: function(){
		var pageTool = this.pageTool;
		if (pageTool) {
			pageTool.doLoad(pageTool.cursor);
		}
	},
	initComponent : function () {
		if(Ext.isEmpty(this.selModel)&&Ext.isEmpty(this.sm)){
	        this.sm = new Ext.grid.RowSelectionModel();
	    }
		var store = new Ext.data.Store(Ext.apply({
			url : 'suning!getAllLogisticsTasks.action',
			reader : new Ext.data.JsonReader({
				totalProperty : 'total',
				root : "rows"
			}, [ "LOGISTICS_ORDER_ID",
			     "ORDER_NO",
			     "WEIGHT",
			     "NET_WEIGHT",
			     "PACK_NO",
			     "GOODS_INFO",
			     "CONSIGNEE",
			     "CONSIGNEE_ADDRESS",
			     "CONSIGNEE_TELEPHONE",
			     "CONSIGNEE_COUNTRY",
			     "SHIPPER",
			     "SHIPPER_ADDRESS",
			     "SHIPPER_TELEPHONE",
			     "SHIPPER_COUNTRY",
			     "NOTE"]),
			listeners:{
			  	"exception": function(proxy,type,action,options,response,arg){
			  		Ext.Msg.alert("提示","加载出错"+
						"<BR>Status:"+response.statusText||"unknow");
			  	}
			}
		},this.storeCfg));
		if(Ext.isEmpty(this.columns)){
			this.columns= [ new Ext.grid.RowNumberer({
				width : 26
			}), {
			    id : "info",
			    header : '',
			    dataIndex : 'info',
			    hideable : false,
			    fixed : true,
			    sortable : false,
			    menuDisabled : true,
			    width : 20, 
			    renderer : function(val,metadata,record,row,col,store){
			    	var attr={};
			    	if(record.get('isUsed')){
			    		attr.image="../../resource/images/btnImages/information.png";
			    		attr.qtip="任务已承接";
			    	}else if(!isTaskAvailable(record)){
			    		attr.image="../../resource/images/btnImages/exclamation.png";
			    		attr.qtip="任务数据异常";
			    	}else{
			    		attr.image="../../resource/images/btnImages/accept.png";
			    	}
			    	if(attr.image)
			    		metadata.attr = 'style="background-image:url('+attr.image+');background-repeat:no-repeat;"';
		    		if(attr.qtip)
		    			metadata.attr += ' ext:qtip="'+attr.qtip+'"';   //关键  
			    }
			},{
			    id : "LOGISTICS_ORDER_ID",
			    header : "LOGISTICS_ORDER_ID",
			    dataIndex : "LOGISTICS_ORDER_ID"
			},{
			    id : "ORDER_NO",
			    header : "订单编号",
			    dataIndex : "ORDER_NO"
			},{
			    id : "WEIGHT",
			    header : "毛重",
			    dataIndex : "WEIGHT"
			},{
			    id : "NET_WEIGHT",
			    header : "净重",
			    dataIndex : "NET_WEIGHT"
			},{
			    id : "PACK_NO",
			    header : "件数",
			    dataIndex : "PACK_NO"
			},{
			    id : "GOODS_INFO",
			    header : "商品信息",
			    dataIndex : "GOODS_INFO"
			},{
			    id : "CONSIGNEE",
			    header : "收货人名称",
			    dataIndex : "CONSIGNEE"
			},{
			    id : "CONSIGNEE_ADDRESS",
			    header : "收货人地址",
			    dataIndex : "CONSIGNEE_ADDRESS"
			},{
			    id : "CONSIGNEE_TELEPHONE",
			    header : "收货人电话",
			    dataIndex : "CONSIGNEE_TELEPHONE"
			},new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_country,
				id : "CONSIGNEE_COUNTRY",
			    header : "收货人所在国",
			    dataIndex : "CONSIGNEE_COUNTRY",
			    valueField: "SN_CODE"
			}),{
			    id : "SHIPPER",
			    header : "发货人名称",
			    dataIndex : "SHIPPER"
			},{
			    id : "SHIPPER_ADDRESS",
			    header : "发货人地址",
			    dataIndex : "SHIPPER_ADDRESS"
			},{
			    id : "SHIPPER_TELEPHONE",
			    header : "发货人电话",
			    dataIndex : "SHIPPER_TELEPHONE"
			},new Ext.ux.grid.CodeNameColumn({
				category: relationCategory_country,
				id : "SHIPPER_COUNTRY",
			    header : "发货人所在国",
			    dataIndex : "SHIPPER_COUNTRY",
			    valueField: "SN_CODE"
			}),{
			    id : "NOTE",
			    header : "备注",
			    dataIndex : "NOTE"
			}/*,{
			    id : "CREAT_TIME",
			    header : "创建时间",
			    dataIndex : "CREAT_TIME",
			    renderer: Renderer.DATE_TIME,
			    width : 140
			}*/];
		}
		Ext.each(this.columns,function(item,index,allItems){
			if(item['dataIndex']){
				var idx=findIndexByProperty(this.showColumns,null,item['dataIndex']);
				item['hidden']=idx<0;
				item['hideable']=!item['hidden'];
			}
			if(Ext.isEmpty(item['width'])&&!Ext.isEmpty(item['header'])){
				item['width']=item['header'].length*20;
			}
			function extendRenderer(val,metadata,record,row,col,store,renderer){
				var data=val;
				if(!Ext.isEmpty(renderer)&&Ext.isFunction(renderer)){
					data=renderer(val,metadata,record,row,col,store);
				}
				if(!Ext.isEmpty(data))
					metadata.attr = 'ext:qtip="' +data+'"';   //关键  
				return data;
			}
			item['renderer']=extendRenderer.createDelegate(undefined,[item['renderer']],6);
		},this);
		var cm = new Ext.grid.ColumnModel({
			defaults : {
				sortable : true
			},
			columns : this.columns
		});
		
        if(Ext.isEmpty(this.store)&&Ext.isEmpty(this.ds)){
            this.store = store;
        }
        if(Ext.isEmpty(this.cm)&&Ext.isEmpty(this.colModel)){
            this.colModel = cm;
        }
        /*if(Ext.isEmpty(this.selModel)&&Ext.isEmpty(this.sm)){
            this.selModel = selModel;
        }*/
        
        if(Ext.isEmpty(this.bbar)&&this.mode!=="local"){
			var bbar = new Ext.PagingToolbar({
				pageSize : this.pageSize,// 每页显示的记录值
				store : this.store,
				displayInfo : false,
				beforePageText: '',
				afterPageText : ''//,
//				displayMsg : '当前 {0} - {1}',
//				emptyMsg : "没有记录"
			});
			this.pageTool=bbar;
			this.bbar = bbar;
        }
        
        if(Ext.isEmpty(this.tbar)&&this.tbar!=false){
			var tbar = [];
			if(this.mode=="remote"){
				tbar.push(
					"开始时间：",{
		    		xtype: 'textfield',
					name : "startTime",
					cls : 'Wdate',
					allowBlank:false,
					listeners: {
						'focus': function(){
							var ID=this.nextSibling().nextSibling().id;
							WdatePicker({
								el : this.id,
								isShowClear : false,
								readOnly : true,
								dateFmt : "yyyy-MM-dd HH:mm:ss",
								autoPickDate : true,
								maxDate : "#F{$dp.$D('"+ID+"')}"
							});
							this.blur();
						}
					}
				},"结束时间：",{
					xtype: 'textfield',
					name : "endTime",
					cls : 'Wdate',
					allowBlank:false,
					listeners: {
						'focus': function(){
							var ID=this.previousSibling().previousSibling().id;
							WdatePicker({
								el : this.id,
								isShowClear : false,
								readOnly : true,
								dateFmt : "yyyy-MM-dd HH:mm:ss",
								autoPickDate : true,
								minDate : "#F{$dp.$D('"+ID+"')}"
							});
							this.blur();
						}
					}
				},{
					text:'查询',
					scale: 'medium',
					icon:'../../resource/images/btnImages/search.png',
					handler: function(b,e){
						this.query();
					}.createDelegate(this)
				});
			}
			tbar.push({
   		        text: '全选',
   		        scale: 'medium',
//   		        name: 'delete',
   		        icon:'../../resource/images/btnImages/tick.png',
   		        handler: function(){
   		        	this.getSelectionModel().selectAll();
   		        }.createDelegate(this)
   			});
			if(this.mode=="local"){
				tbar.push({
	   		        text: '删除',
	   		        scale: 'medium',
	   		        name: 'delete',
	   		        icon:'../../resource/images/btnImages/delete.png',
	   		        handler: function(){
	   		        	var records=this.checkSelect(false);
	   		        	if(records)
	   		        		this.del(records);
	   		        }.createDelegate(this)
	   			});
			}
			this.tbar = tbar;
        }
		Ext.ux.suning.LogisticsGridPanel.superclass.initComponent.call(this);
	}
});

Ext.ux.suning.LogisticsPanel = Ext.extend(Ext.Panel, {
	layout:'card',
    activeItem: 0, //确保在容器的配置项中设置了当前活动项！
    monitorValid : false,
    monitorPoll : 500,

//    bodyStyle:'padding:10px',
    
    rollPage: function(direction){
    	var layout=this.getLayout();
    	layout.setActiveItem(this.activeItem+direction);
    	this.activeItem=this.items.indexOf(layout.activeItem);
    },
	addItem: function(){
		var success=false;
		var itemGridSelect=findByProperty(this.items.getRange(),"name","itemGrid");
		if(itemGridSelect){
			var datas=itemGridSelect.checkSelect(false);
			if(datas){
				if(!Ext.isArray(datas)){
					datas=[datas];
				}
				var itemGrid=findByProperty(this.items.getRange(),"name","itemInfoGrid");
				var dataArr=[];
				for(var i=0;i<datas.length;i++){
					var data=datas[i];
					var ORDER_NO=data.get("ORDER_NO");
					var ITEM_RECORD_IDX = itemGrid.getStore().find("ORDER_NO",ORDER_NO);
					if(ITEM_RECORD_IDX<0){
						dataArr.push(data.data);
					}
				}
				itemGrid.getStore().loadData({'total':dataArr.length,'rows':dataArr},true);
				success=true;
			}
		}
		if(success){
			this.addShoping.createDelegate(this,arguments)();
		}
	},
	saveItems: function(){
		var itemGrid=findByProperty(this.items.getRange(),"name","itemInfoGrid");
		var itemRecords=[];
		itemGrid.getStore().each(function(record){
			itemRecords.push(Ext.encode(record.data));
		});
		var param={
			editType: "add",
			logisticsTaskList: itemRecords
	    };
		this.getEl().mask("执行中...");
		Ext.Ajax.request({
			scope: this,
			url : 'suning!setLogistics.action',
			method : "POST",
			params : param,
			success : function(response,option) {
				this.getEl().unmask();
				var obj = Ext.decode(response.responseText);
				if (obj.returnResult == 0) {
					Ext.Msg.show({
					   title: '失败',
					   buttons: Ext.MessageBox.OK,
//					   icon: Ext.MessageBox.WARNING,
					   msg: "操作数目："+option.params['logisticsTaskList'].length+"，失败数目："+(obj.returnMessage?obj.returnMessage.split("\r\n").length:"")+"。",
					   multiline: true,
					   value: obj.returnMessage,
					   width: 300
					});
				}else{
					if(!Ext.isEmpty(obj.returnMessage)){
			    		Ext.Msg.alert('成功', obj.returnMessage, 
			    		function(){
			    			this.fireEvent('close',this);
			    		}, this);
			    	}else{
			    		this.fireEvent('close',this);
			    	}
				}
			},
			error : function(response) {
				this.getEl().unmask();
				Ext.Msg.alert("异常", response.responseText);
			},
			failure : function(response) {
				this.getEl().unmask();
				Ext.Msg.alert("异常", response.responseText);
			}
		});
	},
	// private
	initItem: function(){
		this.items=[new Ext.ux.suning.TaskQueryGridPanel({
			name:"itemGrid",
			viewConfig:{
				getRowClass : function(record,rowIndex,rowParams,store){
					if(record.get('isUsed')||!isTaskAvailable(record)) return 'x-item-disabled';
		        }
			},
			sm: new Ext.grid.RowSelectionModel({
				listeners:{
					'beforerowselect': function(sm,rowIndex,keepExisting,record){
						return (!record.get('isUsed'))&&isTaskAvailable(record);
					}
				}
			}),
			storeCfg:{
				reader : new Ext.data.JsonReader({
					totalProperty : 'total',
					root : "rows"
				}, [ "LOGISTICS_ORDER_ID",
				     "ORDER_NO",
				     "WEIGHT",
				     "NET_WEIGHT",
				     "PACK_NO",
				     "GOODS_INFO",
				     "CONSIGNEE",
				     "CONSIGNEE_ADDRESS",
				     "CONSIGNEE_TELEPHONE",
				     "CONSIGNEE_COUNTRY",
				     "SHIPPER",
				     "SHIPPER_ADDRESS",
				     "SHIPPER_TELEPHONE",
				     "SHIPPER_COUNTRY",
				     "NOTE",
				     "isUsed"])
			},
			showColumns : [
	            "info",
//	            "LOGISTICS_ORDER_ID",
	       	    "ORDER_NO",
	       	    "WEIGHT",
	       	    "NET_WEIGHT",
	       	    "PACK_NO",
	       	    "GOODS_INFO",
	       	    "CONSIGNEE",
	       	    "CONSIGNEE_ADDRESS",
	       	    "CONSIGNEE_TELEPHONE",
	       	    "CONSIGNEE_COUNTRY",
	       	    "SHIPPER",
	       	    "SHIPPER_ADDRESS",
	       	    "SHIPPER_TELEPHONE",
	       	    "SHIPPER_COUNTRY",
	       	    "NOTE"],
			buttons:[new Ext.Button({
				name: "addInto",
	            text: '加入列表',
	            icon: '../../resource/images/btnImages/cart_put.png',
	            scale: 'large',
	            handler: this.addItem.createDelegate(this)
	        }),new Ext.Button({
	        	name: "next",
	            text: '列表信息',
	            icon: '../../resource/images/btnImages/cart_go.png',
	            scale: 'large',
	            iconAlign: 'right',
	            handler: this.rollPage.createDelegate(this, [1])
	        })]
		}),new Ext.ux.suning.TaskQueryGridPanel({
			mode: 'local',
			name:"itemInfoGrid",
			buttons:[new Ext.Button({
	            text: '添加任务',
	            icon: '../../resource/images/btnImages/package_add.png',
	            scale: 'medium',
	            handler: this.rollPage.createDelegate(this, [-1])
	        }),new Ext.Button({
	        	name: "save",
		    	text : '生成运单',
		    	scale: 'large',
		    	icon : '../../resource/images/btnImages/save.png',
				handler : this.saveItems.createDelegate(this)
		    })]
		})];
	},
	// private
	initEvents : function(){
		Ext.ux.suning.LogisticsPanel.superclass.initEvents.call(this);
		if(this.monitorValid){
			this.startMonitoring();
		}
	},
	bindHandler : function(){
		var itemGrid=findByProperty(this.items.getRange(),"name","itemGrid");
		if(itemGrid){
			var itemData=itemGrid.checkSelect(false,true);
			var valid=itemData!==false;
			var btn=findByProperty(itemGrid.buttons,"name","addInto");
			if(btn){
				btn.setDisabled(!valid);
			}
		}
		itemGrid=findByProperty(this.items.getRange(),"name","itemInfoGrid");
		if(itemGrid){
			var valid=itemGrid.getStore().getCount()>0;
			var btn=findByProperty(itemGrid.buttons,"name","save");
			if(btn){
				btn.setDisabled(!valid);
			}
		}
	},
	startMonitoring : function(){
		if(!this.validTask){
			this.validTask = new Ext.util.TaskRunner();
			this.validTask.start({ 
				run : this.bindHandler,
				interval : this.monitorPoll || 200,
				scope: this
			});
		}
	},
	stopMonitoring : function(){
	    if(this.validTask){
			this.validTask.stopAll();
			this.validTask = null;
		}
	},
	// private
	beforeDestroy : function(){
		this.stopMonitoring();
		Ext.ux.suning.LogisticsPanel.superclass.beforeDestroy.call(this);
	},
	// private
	initComponent : function () {
		this.initItem();
		this.monitorValid=true;
		Ext.ux.suning.LogisticsPanel.superclass.initComponent.call(this);
	},
	addShoping:function(btn,e){
		e.stopPropagation();
		var itemGrid=findByProperty(this.items.getRange(),"name","itemGrid");

		var rowIndex = itemGrid.getStore().indexOf(
				itemGrid.getSelectionModel().getSelections()[0]);
		
		var next=findByProperty(itemGrid.buttons,"name","next");
		
		var target=Ext.get(itemGrid.view.getRow(rowIndex)),
			shop=next.getEl(),
			id=target.id+"-floatOrder";

		if (Ext.isEmpty(Ext.get(id))) {
			Ext.getBody().createChild({
				id: id,
				tag: 'div'
			});
		};
		var obj=Ext.get(id);
		obj.setSize(target.getWidth(),target.getHeight());
		obj.alignTo(target,"c-c");
		obj.dom.innerHTML='<img src="../../resource/images/btnImages/package.png" width="100%" height="100%" />';
//		obj.highlight({duration: .35});
		var tWidth=32;
		var tHeight=32;
		obj.shift({
			width:tWidth,
			height:tHeight,
			x: obj.getAlignToXY(shop, "b-t", [0, -10])[0]+(obj.getWidth()-tWidth)/2,
			y: obj.getAlignToXY(shop, "b-t", [0, -10])[1]+(obj.getHeight()-tHeight),
			duration: .2
		});
		obj.shift({
			x: obj.getAlignToXY(shop, "b-b", [0, 0])[0]+(obj.getWidth()-tWidth)/2,
			y: obj.getAlignToXY(shop, "b-b", [0, 0])[1]+(obj.getHeight()-tHeight),
			duration: .3,
			remove: true
		});
	}
});