/* =========================================================
 * bootstrap-nodes.js v1.0
 * =========================================================
 * Copyright 2017 Taylor Feng
 * Project URL : git@github.com:tayami/taylor-nodes.git
 * ========================================================= */

;(function ($) {

    var Nodes = function(element, data) {
        this.element = element;
        this.data = data;
        this.columnSettings = [];
        this.nodeHtml = "";
        this.bodyHtml = "";
        this.doms = {
            table : "<div class='node-table'>",
            header: "<div class='node-header'>",
            body: "<div class='node-body'>",
            element: "<div class='node-element'>",
            line: "<div class='node-line' >",
            plusBtn: "<i class='node-btn node-btn-open fa fa-caret-right'>",
            minusBtn: "<i class='node-btn node-btn-close fa fa-caret-down'>",
            icon: "<i class='node-icon fa'></i>",
            nodeName: "<span class='node-name'></span>",
            indent: "<span style='display: inline-block'>",
            clearFix: "<span class='clearfix'>"
        };
        this.init();
    };

    Nodes.prototype.init = function(){
        var base = this.element.find('.node-base');
        var extras = this.element.find('.node-extra');
        var columnSettings = [],extraSettings = [];
        var Nodes = this;
        this.nodeHtml = $(this.doms.table);
        columnSettings = [
            {type: 'base', name: base.html(), width: base.attr('data-nodes-width')}
        ];
        extraSettings = [];
        $.each(extras, function(k, v){
            columnSettings.push({type: 'extra', name: $(v).html(), width: $(v).attr('data-nodes-width'), field: $(v).attr('data-nodes-field')});
            extraSettings.push({type: 'extra', name: $(v).html(), width: $(v).attr('data-nodes-width'), field: $(v).attr('data-nodes-field')});
        });
        this.columnSettings = columnSettings;
        this.makeHeader(this.doms);
        this.bodyHtml = $(this.doms.body);
        this.makeLine(this.data, this.bodyHtml, 0, 0);
        this.nodeHtml.append(this.bodyHtml);
        this.nodeHtml.append(this.clearFix);
        this.element.html(this.nodeHtml);

        $('.node-has-child').click(function(){
            var id = $(this).parent().attr('data-node-id');
            if($(this).parent().hasClass('node-expand')) {
                $(this).children('.node-icon').removeClass('fa-folder-open').addClass('fa-folder');
                $(this).children('.node-btn-open').show();
                $(this).children('.node-btn-close').hide();
                $(this).parent().removeClass('node-expand');
                Nodes.setChildesShow(id);
            } else {
                $(this).children('.node-icon').removeClass('fa-folder').addClass('fa-folder-open');
                $(this).children('.node-btn-close').show();
                $(this).children('.node-btn-open').hide();
                $(this).parent().addClass('node-expand');
                Nodes.setChildesShow(id);
            }
        });
        $('.node-btn-open').hide();
    };

    Nodes.prototype.makeHeader = function(doms){
        var node,width,name,headerDom;
        headerDom = $(this.doms.header);
        $.each(this.columnSettings, function(k, v){
            width = v.width;
            name = v.name;
            node = $(doms.element);
            node.css('width', width);
            node.html(name);
            headerDom.append(node);
        });
        this.nodeHtml.append(headerDom);
    };

    Nodes.prototype.makeLine = function(data, html, pid, lv){
        var options,indent,node,icon,extras,name,id,childes,lineDom,columnSettings = this.columnSettings,doms = this.doms;
        var Nodes = this;
        $.each(data, function(k, v){
            lineDom = $(doms.line);
            lineDom.attr('data-node-pid', pid);
            id = v.id;
            childes = v.childes.length;
            name = v.name;
            icon = v.icon;
            extras = v.extra;
            lineDom.attr('data-node-id', id);
            lineDom.attr('data-node-childes', childes);
            if(childes > 0) lineDom.addClass('node-expand');
            $.each(columnSettings, function(c_k, c_v){
                node = $(doms.element);
                node.css('width', c_v.width);
                if(c_v.type == 'base') {
                    node.addClass('node-base');
                    if(lv > 0) {
                        indent = 22*lv;
                        node.append($(doms.indent).css('width', indent+'px'));
                    }
                    if(childes > 0) {
                        node.addClass('node-has-child');
                        node.append(doms.plusBtn);
                        node.append(doms.minusBtn);
                        node.append($(doms.icon).addClass('fa-folder-open'));
                    } else {
                        node.append($(doms.icon).addClass('fa-'+icon));
                    }
                    node.append($(doms.nodeName).html(name));
                } else {
                    node.html(extras[c_v.field]);
                }
                lineDom.append(node);
            });
            html.append(lineDom);
            if(childes > 0) Nodes.makeLine(v.childes, html, id, lv+1);
        });
    };

    Nodes.prototype.setChildesShow = function(id){
        Nodes = this;
        var cid;
        var nodes = $("[data-node-pid='"+id+"']");
        $.each(nodes, function(k,v) {
            cid = $(v).attr('data-node-id');
            if($(v).hasClass('node-expand')) Nodes.setChildesShow(cid);
            $(v).slideToggle(300);
        });
    };

    $.fn['Nodes'] = function(data){
        new Nodes($(this), data);
    };

})(jQuery, window, document);