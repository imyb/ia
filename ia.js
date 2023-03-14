const IA = {};

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

IA.STATETXT = {
    wait : '대기',
    ing : '진행',
    check : '검수',
    complete :'완료',
    delete : '삭제',
};

IA.PAGEOPTION = {
    theme : 'light',
    section : 0,
    author : 0,
    state : 0,
};

IA.includeHTML = (function() {
    function init(callback) {
        let include_tags = document.querySelectorAll('[data-include]');

        if( include_tags.length == 0 ) {
            IA.loading.hide();
            callback();
            return;
        }

        fetchInclude(include_tags, callback)
    }

    async function fetchInclude(include_tags, callback) {
        for(const includeElement of include_tags) {
            const include_file = includeElement.dataset.include;

            await fetch(include_file, {})
                .then(response => {
                    if (!response.ok) {
                        return console.log("HTTP-Error: " + response.status);
                    }
                    return response.text();
                })
                .then(data => {
                    let _tempHtml1 = document.createElement("div");
                    let _tempHtml2 = document.createElement("div");

                    _tempHtml1.innerHTML = data;

                    _tempHtml1.querySelectorAll('.ia-section').forEach(function(section) {
                        _tempHtml2.innerHTML += section.outerHTML;
                    });

                    includeElement.outerHTML = _tempHtml2.innerHTML;

                    _tempHtml1 = null;
                    _tempHtml2 = null;
                });
        }
        await callback();
    };

    return {
        init : init,
    }
})();

IA.urlParam = (function() {
    function init() {
        const urlParams = new URLSearchParams(window.location.search);
        const obj = {};

        for (const [key, value] of urlParams.entries()) {
            if( IA.PAGEOPTION.hasOwnProperty(key) ) {
                obj[key] = value
            }
        }

        Object.assign(IA.PAGEOPTION, obj);
    }

    function setParams(obj) {
        const urlParams = new URLSearchParams(window.location.search);
        const urlPath = window.location.origin + window.location.pathname;
        let strParams;
        let strUrl;

        for (const [key] of urlParams.entries()) {
            if( !IA.PAGEOPTION.hasOwnProperty(key) ) {
                urlParams.delete(key)
            }
        }

        Object.assign(IA.PAGEOPTION, obj);

        for (const key in IA.PAGEOPTION) {
            if( IA.PAGEOPTION[key] == null || IA.PAGEOPTION[key] == 0 ) {
                urlParams.delete(key)
            } else {
                urlParams.set(key, IA.PAGEOPTION[key])
            }
        }

        strParams = urlParams.toString() ? '?' + urlParams.toString() : '';
        strUrl = urlPath + strParams;

        history.pushState(IA.PAGEOPTION, null, strUrl);
    }

    return {
        init : init,
        setParams : setParams,
    }
})();

IA.tdNumber = (function() {
    function init() {
        let count = 1;

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
            let anchor = element.querySelector('a');
            let href = anchor.getAttribute('href');

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
            let stateTxt = element.innerText.trim();

            if( !stateTxt ) {
                stateTxt = IA.STATETXT.wait;
                element.innerText = stateTxt;
            }

            for (const key in IA.STATETXT) {
                if( IA.STATETXT[key] == stateTxt ) {
                    element.classList.add(key);
                }
            }

            if( stateTxt == IA.STATETXT.delete ) {
                element.parentElement.classList.add('del');
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
        let _this = element;

        if( _this.parentElement.classList.contains('is-open') ) {
            _moreClose(_this);
        } else {
            _moreOpen(_this);
        }
    }

    function thMoreBtnClick(element) {
        let _this = element;
        let this_tdNotes = _this.closest(IA.SELECTOR.table).querySelectorAll(IA.SELECTOR.td_note);

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
        let _this = element;

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
        document.querySelectorAll(IA.SELECTOR.td_state).forEach(function(element) {
            let stateTxt = element.innerText.trim();

            for (const key in IA.STATETXT) {
                if( IA.STATETXT[key] == stateTxt ) {
                    IA.COUNT[key]++
                }
            }

            IA.COUNT.total++;
        });

        document.querySelectorAll('[data-count-state]').forEach(function(element) {
            for (const key in IA.COUNT) {
                if( key == element.dataset.countState ) {
                    element.innerHTML = IA.COUNT[key];
                }
            }
        });
    }

    function filterPage() {
        const FILTER_COUNT = {};

        Object.assign(FILTER_COUNT, IA.COUNT);

        for(const key in FILTER_COUNT) {
            FILTER_COUNT[key] = 0;
        }

        document.querySelectorAll(IA.SELECTOR.td_state).forEach(function(element) {
            let stateTxt = element.innerText.trim();

            if( element.parentElement.hidden == true || element.closest(IA.SELECTOR.section).hidden == true ) {
                return;
            }

            for (const key in IA.STATETXT) {
                if( IA.STATETXT[key] == stateTxt ) {
                    FILTER_COUNT[key]++
                }
            }

            FILTER_COUNT.total++;
        });

        document.querySelectorAll('[data-filter-count-state]').forEach(function(element) {
            for (const key in FILTER_COUNT) {
                if( key == element.dataset.filterCountState ) {
                    element.innerHTML = FILTER_COUNT[key];
                }
            }
        });
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

        let filter_author = document.querySelector('[data-filter="author"]');
        let filter_state = document.querySelector('[data-filter="state"]');

        if( IA.PAGEOPTION.author || IA.PAGEOPTION.state ) {
            if( IA.PAGEOPTION.author && filter_author.options[IA.PAGEOPTION.author] ) {
                filter_author.options[IA.PAGEOPTION.author].selected = true;
            }
            if( IA.PAGEOPTION.state && filter_state.options[IA.PAGEOPTION.state]) {
                filter_state.options[IA.PAGEOPTION.state].selected = true;
            }
            change();
        }
    }

    function change() {
        let filter_author = document.querySelector('[data-filter="author"]');
        let filter_state = document.querySelector('[data-filter="state"]');
        let filter_author_value = filter_author.value;
        let filter_state_value = filter_state.value;
        let filter_author_text = filter_author.options[filter_author_value].text.trim();
        let filter_state_text = filter_state.options[filter_state_value].text.trim();

        document.querySelectorAll(IA.SELECTOR.tbody_tr).forEach(function(element) {

            let td_author_text = element.querySelector(IA.SELECTOR.td_author).innerText.trim();
            let td_state_text = element.querySelector(IA.SELECTOR.td_state).innerText.trim();

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
    let header_height = 0;

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
        let theme = document.querySelector('[data-ia="theme"]');

        if( !theme ) {
            return;
        }
        if( IA.PAGEOPTION.theme ) {
            if( theme.querySelector('option[value="' + IA.PAGEOPTION.theme + '"]') ) {
                theme.querySelector('option[value="' + IA.PAGEOPTION.theme + '"]').selected = true;
            }
            change();
        }
    }

    function change() {
        let theme = document.querySelector('[data-ia="theme"]');

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
            let page_num = element.querySelectorAll(IA.SELECTOR.tbody_tr).length;

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

        if( IA.PAGEOPTION.section && document.querySelectorAll(IA.SELECTOR.nav_btn)[IA.PAGEOPTION.section] ) {
            navBtnClick(document.querySelectorAll(IA.SELECTOR.nav_btn)[IA.PAGEOPTION.section]);
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
            let section_title = section.querySelector(IA.SELECTOR.section_title).innerText;
            let section_count = section.querySelector(IA.SELECTOR.section_title).dataset.count;
            let section_num = i+1;

            document.querySelector(IA.SELECTOR.nav_ul).insertAdjacentHTML('beforeend', '<li><a href="javascript:void(0);" data-section-num=' + section_num + '>' + section_title + ' (' + section_count + ')</li>');
            section.dataset.sectionNum = section_num;
        });
    }

    function navBtnClick(element) {
        let _this = element;
        let _this_section_num = _this.dataset.sectionNum;

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