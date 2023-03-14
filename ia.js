var IA = {};

document.addEventListener('DOMContentLoaded', function() {
    IA.loading.show();

    IA.includeHTML.init(function() {
        IA.urlParam.init();
        IA.tdNumber.init();
        IA.tdUrl.init();
        IA.tdState.init();
        IA.tdNote.init();
        IA.trActive.init();
        IA.filter.init();
        IA.infoCount.init();
        IA.sectionInfo.init();
        IA.sectionNav.init();
        IA.header.init();
        IA.theme.init();

        setTimeout(function() {
            IA.loading.hide();
        }, 600);
    });
});

IA.SELECTOR = {
    header : '.ia-header',
    section : '.ia-section',
    section_title : '.ia-section-title',

    nav : '.ia-section-nav',
    nav_ul : '.ia-section-nav > ul',
    nav_btn : '.ia-section-nav > ul > li > a',

    table : '.ia-section-table',
    thead_tr : '.ia-section-table thead tr',
    tbody_tr : '.ia-section-table tbody tr',

    td_no : '.ia-section-table td.no',
    td_author : '.ia-section-table td.author',
    td_state : '.ia-section-table td.state',
    td_url : '.ia-section-table td.url',
    td_note : '.ia-section-table td.note',

    th_no : '.ia-section-table th.no',
    th_note : '.ia-section-table th.note',
};

IA.COUNT = {
    total : 0,
    wait : 0,
    ing : 0,
    check : 0,
    complete : 0,
    delete : 0,
};

IA.PAGESTATE = {
    theme : '',
    section : 0,
    author : 0,
    state : 0,
};

IA.includeHTML = (function() {
    function init(callback) {
        var include_tags = document.querySelectorAll('[data-include]');

        if( include_tags.length == 0 ) {
            IA.loading.hide();
            callback();
            return;
        }

        include_tags.forEach(function(element, i) {
            var include_file = element.dataset.include;
            var _temp1 = document.createElement("div");
            var _temp2 = document.createElement("div");
            var xhttp;

            if( include_file ) {
                xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function() {
                    if (this.readyState == 4 && this.status == 200) {
                        _temp1.innerHTML = this.responseText;
                        _temp1.querySelectorAll('.ia-section').forEach(function(section) {
                            _temp2.innerHTML += section.outerHTML;
                        });
                        element.outerHTML = _temp2.innerHTML;

                        _temp1 = null;
                        _temp2 = null;

                        if( include_tags.length <= i+1 ) {
                            setTimeout(function() {
                                callback();
                            });
                        }
                    }
                };
                xhttp.open('GET', include_file, true);
                xhttp.send();
            }
        });
    }

    return {
        init : init,
    }
})();

IA.urlParam = (function() {
    function init() {
        var urlParams = new URLSearchParams(window.location.search);
        var obj = {};

        for (var [key, value] of urlParams.entries()) {
            if( IA.PAGESTATE.hasOwnProperty(key) ) {
                obj[key] = value
            }
        }

        Object.assign(IA.PAGESTATE, obj);
    }

    function setParams(obj) {
        var urlParams = new URLSearchParams(window.location.search);
        var urlPath = window.location.origin + window.location.pathname;
        var strParams;
        var strUrl;

        for (var [key] of urlParams.entries()) {
            if( !IA.PAGESTATE.hasOwnProperty(key) ) {
                urlParams.delete(key)
            }
        }

        Object.assign(IA.PAGESTATE, obj);

        for (var key in IA.PAGESTATE) {
            if( IA.PAGESTATE[key] == null || IA.PAGESTATE[key] == 0 ) {
                urlParams.delete(key)
            } else {
                urlParams.set(key, IA.PAGESTATE[key])
            }
        }

        strParams = urlParams.toString() ? '?' + urlParams.toString() : '';
        strUrl = urlPath + strParams;

        history.pushState(IA.PAGESTATE, null, strUrl);
    }

    return {
        init : init,
        setParams : setParams,
    }
})();

IA.tdNumber = (function() {
    function init() {
        var count = 1;

        if( !document.querySelector(IA.SELECTOR.tbody_tr) ) {
            return;
        }

        document.querySelectorAll(IA.SELECTOR.thead_tr).forEach(function(element) {
            if( element.querySelectorAll(IA.SELECTOR.th_no).length <= 0 ) {
                element.insertAdjacentHTML('afterbegin', '<th scope="col" class="no">No</th>');
            }
        });

        document.querySelectorAll(IA.SELECTOR.tbody_tr).forEach(function(element) {
            if( element.querySelectorAll(IA.SELECTOR.td_no).length <= 0 ) {
                element.insertAdjacentHTML('afterbegin', '<td class="no"></td>');
            }

            // if( element.style.display !== 'none' && element.closest(IA.SELECTOR.section).style.display != 'none' ) {
            if( element.hidden != true && element.closest(IA.SELECTOR.section).hidden != true ) {
                element.querySelector(IA.SELECTOR.td_no).innerText = count;
                count++;
            }
        });
    }

    return {
        init : init
    }
})();

IA.tdUrl = (function() {
    function init() {
        if( !document.querySelector(IA.SELECTOR.td_url) ) {
            return;
        }

        document.querySelectorAll(IA.SELECTOR.td_url).forEach(function(element) {
            var anchor = element.querySelector('a');
            var href = anchor.getAttribute('href');

            anchor.setAttribute('target', '_blank');
            anchor.innerHTML = href;
        });
    }

    return {
        init : init
    }
})();

IA.tdState = (function() {
    function init() {
        if( !document.querySelector(IA.SELECTOR.td_state) ) {
            return;
        }

        document.querySelectorAll(IA.SELECTOR.td_state).forEach(function(element) {
            switch(element.innerText.trim()) {
                case '대기' :
                    element.classList.add('type1');
                    break;
                case '진행' :
                    element.classList.add('type2');
                    break;
                case '검수' :
                    element.classList.add('type3');
                    break;
                case '완료' :
                    element.classList.add('type4');
                    break;
                case '삭제' :
                    element.classList.add('type5');
                    element.parentElement.classList.add('del')
                    break;
                default :
                    element.innerText = '대기';
                    element.classList.add('type1');
            }
        });
    }

    return {
        init : init
    }
})();

IA.tdNote = (function() {
    function init() {
        if( !document.querySelector(IA.SELECTOR.td_note) ) {
            return;
        }

        document.querySelectorAll(IA.SELECTOR.td_note).forEach(function(td_note) {
            if( td_note.children.length > 1 ) {
                td_note.classList.add('has-more');
                td_note.insertAdjacentHTML('afterbegin', '<button type="button" class="btn_more">+</button>');
                td_note.closest(IA.SELECTOR.table).dataset.hasMore = true;
            } else {
                td_note.closest(IA.SELECTOR.table).dataset.hasMore = false;
            }

            if( td_note.querySelector('.btn_more') ) {
                td_note.querySelector('.btn_more').addEventListener('click', function() {
                    tdMoreBtnClick(this);
                });
            }
        });

        document.querySelectorAll(IA.SELECTOR.th_note).forEach(function(th_note) {
            if( th_note.closest(IA.SELECTOR.table).dataset.hasMore == 'true' ) {
                th_note.insertAdjacentHTML('afterbegin', '<button type="button" class="btn_more">+</button>');
            }

            if( th_note.querySelector('.btn_more') ) {
                th_note.querySelector('.btn_more').addEventListener('click', function() {
                    thMoreBtnClick(this);
                });
            }
        });
    }

    function tdMoreBtnClick(element) {
        var _this = element;

        if( _this.parentElement.classList.contains('is-open') ) {
            _moreClose(_this);
        } else {
            _moreOpen(_this);
        }
    }

    function thMoreBtnClick(element) {
        var _this = element;
        var this_tdNotes = _this.closest(IA.SELECTOR.table).querySelectorAll(IA.SELECTOR.td_note);

        if( _this.parentElement.classList.contains('is-open') ) {
            _moreClose(_this);

            this_tdNotes.forEach(function(element) {
                if( element.classList.contains('has-more') ) {
                    _moreClose(element.querySelector('.btn_more'));
                }
            });
        } else {
            _moreOpen(_this);

            this_tdNotes.forEach(function(element) {
                if( element.classList.contains('has-more') ) {
                    _moreOpen(element.querySelector('.btn_more'));
                }
            });
        }
    }

    function _moreOpen(element) {
        element.parentElement.classList.add('is-open');
        element.innerText = '-';
    }

    function _moreClose(element) {
        element.parentElement.classList.remove('is-open');
        element.innerText = '+';
    }

    return {
        init : init,
        tdMoreBtnClick : tdMoreBtnClick,
        thMoreBtnClick : thMoreBtnClick,
    }
})();

IA.trActive = (function() {
    function init() {
        if( !document.querySelector(IA.SELECTOR.tbody_tr) ) {
            return;
        }

        document.querySelectorAll(IA.SELECTOR.tbody_tr).forEach(function(element) {
            element.addEventListener('click', function() {
                trClick(this);
            });
        });

        document.addEventListener('click', function(event) {
            trOutsideClick(this, event);
        });
        document.addEventListener('dblclick', function(event) {
            trOutsideClick(this, event);
        });
    }

    function trClick(element) {
        var _this = element;

        if( !_this.classList.contains('active') ) {
            _this.classList.add('active');
        } else {
            _this.classList.remove('active');
        }

        document.querySelectorAll(IA.SELECTOR.tbody_tr).forEach(function(tr) {
            tr.classList.remove('focus');
        });

        _this.classList.add('focus');
    }

    function trOutsideClick(element, event) {
        document.querySelectorAll(IA.SELECTOR.tbody_tr).forEach(function(element) {
            if( !event.target.closest('table') ) {
                element.classList.remove('focus');

                if( event.type == 'dblclick' ) {
                    element.classList.remove('active');
                }
            }
        });
    }

    return {
        init : init
    }
})();

IA.infoCount = (function() {
    function init() {
        if( !document.querySelector('.ia-project-info') ) {
            return;
        }

        totalPage();
        filterPage();
    }

    function totalPage() {
        IA.COUNT = {
            total : 0,
            wait : 0,
            ing : 0,
            check : 0,
            complete : 0,
            delete : 0,
        }

        document.querySelectorAll(IA.SELECTOR.td_state).forEach(function(element) {
            IA.COUNT.total++;
            switch(element.innerText.trim()) {
                case '대기' :
                    IA.COUNT.wait++;
                    break;
                case '진행' :
                    IA.COUNT.ing++;
                    break;
                case '검수' :
                    IA.COUNT.check++;
                    break;
                case '완료' :
                    IA.COUNT.complete++;
                    break;
                case '삭제' :
                    IA.COUNT.delete++;
                    break;
                default : 0;
            }
        });

        document.querySelector('[data-count-state="total"]').innerHTML = IA.COUNT.total;
        document.querySelector('[data-count-state="wait"]').innerHTML = IA.COUNT.wait;
        document.querySelector('[data-count-state="ing"]').innerHTML = IA.COUNT.ing;
        document.querySelector('[data-count-state="check"]').innerHTML = IA.COUNT.check;
        document.querySelector('[data-count-state="complete"]').innerHTML = IA.COUNT.complete;
        document.querySelector('[data-count-state="delete"]').innerHTML = IA.COUNT.delete;
    }

    function filterPage() {
        var filter_count_total = 0;
        var filter_count_wait = 0;
        var filter_count_ing = 0;
        var filter_count_check = 0;
        var filter_count_complete = 0;
        var filter_count_delete = 0;

        document.querySelectorAll(IA.SELECTOR.td_state).forEach(function(element) {
            if( element.parentElement.hidden != true && element.closest(IA.SELECTOR.section).hidden != true ) {
                filter_count_total++;
                switch(element.innerText.trim()) {
                    case '대기' :
                        filter_count_wait++;
                        break;
                    case '진행' :
                        filter_count_ing++;
                        break;
                    case '검수' :
                        filter_count_check++;
                        break;
                    case '완료' :
                        filter_count_complete++;
                        break;
                    case '삭제' :
                        filter_count_delete++;
                        break;
                    default : 0;
                }
            }
        });

        document.querySelector('[data-filter-count-state="total"]').innerHTML = filter_count_total;
        document.querySelector('[data-filter-count-state="wait"]').innerHTML = filter_count_wait;
        document.querySelector('[data-filter-count-state="ing"]').innerHTML = filter_count_ing;
        document.querySelector('[data-filter-count-state="check"]').innerHTML = filter_count_check;
        document.querySelector('[data-filter-count-state="complete"]').innerHTML = filter_count_complete;
        document.querySelector('[data-filter-count-state="delete"]').innerHTML = filter_count_delete;
    }

    return {
        init : init,
        totalPage : totalPage,
        filterPage : filterPage,
    }
})();

IA.filter = (function() {
    function init() {
        if( !document.querySelector('.ia-project-info .option-filter') ) {
            return;
        }

        var filter_author = document.querySelector('[data-filter="author"]');
        var filter_state = document.querySelector('[data-filter="state"]');

        if( IA.PAGESTATE.author || IA.PAGESTATE.state ) {
            if( IA.PAGESTATE.author && filter_author.options[IA.PAGESTATE.author] ) {
                filter_author.options[IA.PAGESTATE.author].selected = true;
            }
            if( IA.PAGESTATE.state && filter_state.options[IA.PAGESTATE.state]) {
                filter_state.options[IA.PAGESTATE.state].selected = true;
            }
            change();
        }
    }

    function change() {
        var filter_author = document.querySelector('[data-filter="author"]');
        var filter_state = document.querySelector('[data-filter="state"]');
        var filter_author_value = filter_author.value;
        var filter_state_value = filter_state.value;
        var filter_author_text = filter_author.options[filter_author_value].text.trim();
        var filter_state_text = filter_state.options[filter_state_value].text.trim();

        document.querySelectorAll(IA.SELECTOR.tbody_tr).forEach(function(element) {

            var td_author_text = element.querySelector(IA.SELECTOR.td_author).innerText.trim();
            var td_state_text = element.querySelector(IA.SELECTOR.td_state).innerText.trim();

            if( (td_author_text == filter_author_text || filter_author_value == 0) && (td_state_text == filter_state_text || filter_state_value == 0) ) {
                element.hidden = false;
            } else {
                element.hidden = true;
            }
        });

        if( filter_author.value > 0) {
            filter_author.classList.add('is-selected');
        } else {
            filter_author.classList.remove('is-selected');
        }

        if( filter_state.value > 0) {
            filter_state.classList.add('is-selected');
        } else {
            filter_state.classList.remove('is-selected');
        }

        IA.urlParam.setParams({
            author : filter_author_value,
            state : filter_state_value,
        });

        IA.tdNumber.init();
        IA.infoCount.filterPage();
    }

    return {
        init : init,
        change : change
    }
})();

IA.header = (function() {
    var header_height = 0;

    function init() {
        if( !document.querySelector(IA.SELECTOR.header) ) {
            return;
        }

        _setValData()

        window.addEventListener('resize', function() {
            _setValData()
        });
        window.addEventListener('scroll', function() {
            _setValData()
        });
    }

    function _setValData() {
        if( document.querySelectorAll(IA.SELECTOR.header).length == 0 ) {
            header_height = 0;
        } else {
            header_height = document.querySelector(IA.SELECTOR.header).getBoundingClientRect().height;
        }
        document.querySelector(':root').style.cssText = '--header-height:' + header_height + 'rem';
    }

    return {
        init : init
    }
})();

IA.theme = (function() {

    function init() {
        var theme = document.querySelector('[data-ia="theme"]');

        if( !theme ) {
            return;
        }
        if( IA.PAGESTATE.theme ) {
            if( theme.querySelector('option[value="' + IA.PAGESTATE.theme + '"]') ) {
                theme.querySelector('option[value="' + IA.PAGESTATE.theme + '"]').selected = true;
            }
            change();
            console.log('theme')
        }
    }

    function change() {
        var theme = document.querySelector('[data-ia="theme"]');

        theme.querySelectorAll('option').forEach(function(opt) {
            document.querySelector('html').classList.remove('theme-' + opt.value);
        });

        if( theme.value && theme.value != 0 ) {
            document.querySelector('html').classList.add('theme-' + theme.value)
        }

        IA.urlParam.setParams({
            theme : theme.value,
        });
    }

    return {
        init : init,
        change : change
    }
})();

IA.sectionInfo = (function() {
    function init() {
        if( !document.querySelector(IA.SELECTOR.section) ) {
            return;
        }

        document.querySelectorAll(IA.SELECTOR.section).forEach(function(element) {
            var page_num = element.querySelectorAll(IA.SELECTOR.tbody_tr).length;

            element.querySelector(IA.SELECTOR.section_title).dataset.count = page_num;
        });
    }

    return {
        init : init
    }
})();

IA.sectionNav = (function() {
    function init() {
        if( !document.querySelector(IA.SELECTOR.header) ) {
            return;
        }

        createNav();

        if( IA.PAGESTATE.section && document.querySelectorAll(IA.SELECTOR.nav_btn)[IA.PAGESTATE.section] ) {
            navBtnClick(document.querySelectorAll(IA.SELECTOR.nav_btn)[IA.PAGESTATE.section]);
        } else {
            IA.urlParam.setParams({
                section : 0
            });
        }

        document.querySelectorAll(IA.SELECTOR.nav_btn).forEach(function(nav_btn, i) {
            nav_btn.addEventListener('click', function(e) {
                navBtnClick(this);
            })
        });
    }

    function createNav() {
        document.querySelector(IA.SELECTOR.header).insertAdjacentHTML('beforeend', '<div class="ia-section-nav"><ul><li class="is-active"><a href="javascript:void(0);" data-section-num="0">전체 (' + IA.COUNT.total + ')</li></ul></div>');

        document.querySelectorAll(IA.SELECTOR.section).forEach(function(section, i) {
            var section_title = section.querySelector(IA.SELECTOR.section_title).innerText;
            var section_count = section.querySelector(IA.SELECTOR.section_title).dataset.count;
            var section_num = i+1;

            document.querySelector(IA.SELECTOR.nav_ul).insertAdjacentHTML('beforeend', '<li><a href="javascript:void(0);" data-section-num=' + section_num + '>' + section_title + ' (' + section_count + ')</li>');
            section.dataset.sectionNum = section_num;
        });
    }

    function navBtnClick(element) {
        var _this = element;
        var _this_section_num = _this.dataset.sectionNum;

        document.querySelectorAll(IA.SELECTOR.nav_btn).forEach(function(nav_btn) {
            nav_btn.parentElement.classList.remove('is-active');
        });

        _this.parentElement.classList.add('is-active');

        document.querySelectorAll(IA.SELECTOR.section).forEach(function(section) {
            if( section.dataset.sectionNum == _this_section_num || _this_section_num == 0 ) {
                section.hidden = false;
            } else {
                section.hidden = true;
            }
        });

        IA.urlParam.setParams({
            section : _this_section_num
        });

        IA.tdNumber.init();
        IA.infoCount.filterPage();
    }

    return {
        init : init,
        createNav : createNav,
        navBtnClick : navBtnClick,
    }

})();

IA.loading = (function() {
    function show() {
        document.querySelector('body').classList.add('is-loading');
    }

    function hide() {
        document.querySelector('body').classList.remove('is-loading');
    }

    return {
        show : show,
        hide : hide
    }
})();