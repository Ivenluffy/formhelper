/*!
  * formhelper v1.0
  * (c) 2020 Iven Wong
  * Released under the MIT License.
  */
(function(global,factory){
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
        typeof define === 'function' && define.amd ? define(factory) :
            (global = global || self, global.FormHelper = factory());
})(this,function(){"use strict";

    //#region 表单工具
    /**
     * 表单工具
     * @param {string|HTMLElement} elSelector -容器元素的CSS选择器字符串或html对象
     */
    function FormHelper(elSelector) {
        if (!(this instanceof FormHelper)) return new FormHelper(elSelector);
        this.form = typeof (elSelector) === "string"
            ? document.querySelector(elSelector)
            : (((typeof HTMLElement === 'object')
                ? (elSelector instanceof HTMLElement)
                : (elSelector && typeof elSelector === 'object' && elSelector.nodeType === 1 && typeof elSelector.nodeName === 'string'))
                ? elSelector : null)
    }
    FormHelper.prototype = {
        constructor: FormHelper,
        /**
         * 清空表单
         */
        clearForm:function() {
            var selects = this.form.querySelectorAll("select");
            var textareas = this.form.querySelectorAll("textarea");
            var inputs = this.form.querySelectorAll("input");
            selects.forEach(function (item) {
                item.value = "";
            });
            textareas.forEach(function (item) {
                item.value = "";
            });
            inputs.forEach(function (item) {
                var type = item.getAttribute("type");
                switch (type) {
                    case "radio":
                    case "checkbox":
                        item.checked = false;
                        break;
                    case "color":
                        item.value = "#000000";
                        break;
                    case "image":
                        item.removeAttribute("value");
                        item.removeAttribute("src");
                        break;
                    case "button":
                    case "submit":
                    case "reset":
                        break;
                    default:
                        item.value = "";
                        break;
                }
            });
            return this;
        },
        /**
         * 重置表单数据
         */
        resetForm:function() {
            try {
                this.form.reset();
            } catch (e) {
                console.log("请检查表单内是否含有'reset'字段名或其它可能错误!")
            }
            return this;
        },
        /**
         * 设置加载表单数据
         * @param {object} data -表单数据
         */
        setData:function(data) {
            if(!data){return this;}
            if(typeof data!=="object"){
                if(typeof data==="string"){
                    try{
                        data=JSON.parse(data);
                    }catch (e) {
                        data={};
                    }
                }else{
                    data={};
                }
            }
            var selects = this.form.querySelectorAll("select");
            var textareas = this.form.querySelectorAll("textarea");
            var inputs = this.form.querySelectorAll("input");
            var name = "";
            selects.forEach(function (item) {
                name = item.getAttribute("name");
                if (name && (name in data)) {item.value = data[name];}
                else {item.value="";}
            });
            textareas.forEach(function (item) {
                name = item.getAttribute("name");
                if (name && (name in data)) {item.value = data[name];}
                else {item.value="";}
            });
            inputs.forEach(function (item) {
                var type = item.getAttribute("type");
                switch (type) {
                    case "radio":
                        name = item.getAttribute("name");
                        if (name && (name in data)) {
                            item.checked = data[name] === item.value ? true : false;
                        }else{
                            item.checked=false;
                        }
                        break;
                    case "checkbox":
                        name = item.getAttribute("name");
                        if (name && (name in data)) {
                            var arr = data[name].split(",");
                            item.checked = arr.some(function (m) {return m === item.value}) ? true : false;
                        }else{
                            item.checked=false;
                        }
                        break;
                    case "image":
                        name = item.getAttribute("name");
                        if (name && (name in data)) {
                            item.value = data[name];
                            item.src = data[name];
                        }else{
                            item.value="";
                            item.src="";
                        }
                        break;
                    case "file":
                    case "button":
                    case "submit":
                    case "reset":
                        break;
                    default:
                        name = item.getAttribute("name");
                        if (name && (name in data)) {item.value = data[name];}
                        else {item.value="";}
                        break;
                }
            });
            return this;
        },
        /**
         * 获取表单json格式数据
         * @returns {object} json数据
         */
        getData: function () {
            var list = this.form.querySelectorAll("[name]");
            var obj = {};
            list.forEach(function (item) {
                var name = item.getAttribute("name");
                var tag = item.tagName;
                switch (tag) {
                    case "INPUT":
                        var type = item.getAttribute("type");
                        switch (type) {
                            case "radio":
                                if (!(name in obj)) {obj[name] = "";}
                                if (item.checked) {obj[name] = item.value;}
                                break;
                            case "checkbox":
                                if (!(name in obj)) {obj[name] = new Array();}
                                if (item.checked) {obj[name].push(item.value);}
                                break;
                            case "button":
                            case "submit":
                            case "reset":
                                break;
                            default:
                                obj[name] = item.value;
                                break;
                        }
                        break;
                    default:
                        obj[name] = item.value;
                        break;
                }
            });
            for (var k in obj) {
                if (Array.isArray(obj[k])) {
                    obj[k] = obj[k].join(",");
                }
            }
            return obj;
        },
        /**
         * 获取表单FormData对象
         * @returns {FormData} FormData对象
         */
        getFormData:function() {
            return new FormData(this.form);
        }
    };
    //#endregion

    return FormHelper;
});
