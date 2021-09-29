/**
 * ================================================
 *
 * [works]
 *
 * ================================================
 */
let rTimer = false,
  isFirst = true;

const per_page = 21;

let categories_json = home_dir + 'content/wp-json/wp/v2/' + type + '_works_category?_fields=id,count,name,slug';
let entries_json = home_dir + 'content/wp-json/wp/v2/' + type + '_works?_fields=id,title,data&per_page=' + per_page + '&' + type + '_works_category=' + category;

const types = [
  {
    path: 'web',
    name: 'Web'
  },
  {
    path: 'graphic',
    name: 'Graphic Design / Photo Retouch'
  }
];

(function($) {
  $(function() {
    /**
     ********************************************
     * load event
     ********************************************
     */
    functions.init();
    /**
     ********************************************
     * resize event
     ********************************************
     */
    $(window).on('resize', function() {
      if (rTimer !== false) {
        clearTimeout(rTimer);
      }

      rTimer = setTimeout(function() {
        functions.adjust();
        if ($.params.isChangeMode) {
          location.reload();
        }
      }, 1000);
    });
    $(document).on('click', '.worksWrapper .item a.disabled', function() {
      return false;
    });
  });
}(jQuery));
/**
 **********************************************************
 *
 * functions
 *
 **********************************************************
 */
const functions = {
  init: function() {
    // functions.loadCategories();
    // functions.loadPosts();

    setTimeout(function() {
      functions.adjust();
    }, 500);
  },
  adjust: function() {
    //
  }
};

class Entries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      entries: [],
      type: type,
      category: category,
      total: 0,
      totalPages: 0,
      page: page,
      isChanged: false
    };
    this.updateType = this.updateType.bind(this);
    this.updateCategory = this.updateCategory.bind(this);
    this.updatePage = this.updatePage.bind(this);
  }
  loadCategories() {
		$.ajax({
			url: categories_json,
			dataType: 'json',
			// cache: false,
      context: this
    }).done((data, status, xhr) => {
      // console.log(data);
      // console.log(xhr.getResponseHeader('X-WP-Total'));
      // console.log(xhr.getResponseHeader('X-WP-TotalPages'));
      this.setState({ categories: data });
    }).fail((xhr, status, error) => {
      console.error(this.props.categories_url, status, error.toString());
    });
	}
  loadEntries() {
    $.ajax({
			url: entries_json,
			dataType: 'json',
			// cache: false,
      context: this,
      beforeSend: function() {
        $('#js-container').addClass('loading');
      }
    }).done((data, status, xhr) => {
      // console.log(data);
      // console.log(xhr.getResponseHeader('X-WP-Total'));
      // console.log(xhr.getResponseHeader('X-WP-TotalPages'));
      this.setState({
        entries: data,
        total: xhr.getResponseHeader('X-WP-Total'),
        totalPages: xhr.getResponseHeader('X-WP-TotalPages')
      });
      $('#js-container').removeClass('loading');
      if (this.state.isChanged) {
        $('.sectionVox').velocity('scroll', {
          duration: 200,
          offset: -($('#siteHeader').outerHeight())
        });
      }
    }).fail((xhr, status, error) => {
      console.error(this.props.entries_url, status, error.toString());
    });
  }
	componentDidMount() {
		this.loadCategories();
  	this.loadEntries();
	}
  updateType(type) {
    this.setState({
      type: type,
      category: '',
      page: 1,
      isChanged: true
    });
    categories_json = home_dir + 'content/wp-json/wp/v2/' + type + '_works_category?_fields=id,count,name,slug';
    entries_json = home_dir + 'content/wp-json/wp/v2/' + type + '_works?_fields=id,title,data&per_page=21';
    this.loadCategories();
  	this.loadEntries();
  }
  updateCategory(category) {
    this.setState({
      category: category,
      page: 1,
      isChanged: true
    });
    entries_json = home_dir + 'content/wp-json/wp/v2/' + this.state.type + '_works?_fields=id,title,data&per_page=21&' + this.state.type + '_works_category=' + category;
    this.loadEntries();
  }
  updatePage(page) {
    this.setState({
      page: page,
      isChanged: true
    });
    entries_json = home_dir + 'content/wp-json/wp/v2/' + this.state.type + '_works?_fields=id,title,data&per_page=21&' + this.state.type + '_works_category=' + this.state.category + '&page=' + page;
    this.loadEntries();
  }
  render() {
    return(
      <React.Fragment>
        <TypesComponent state={this.state} func={this.updateType} />
        <CategoriesComponent state={this.state} func={this.updateCategory} />
        <EntriesComponent state={this.state} />
        <PagenationComponent state={this.state} func={this.updatePage} />
      </React.Fragment>
    );
  }
}

const TypesComponent = (props) => {
  const state = props.state;
  const getType = (e) => {
    e.preventDefault();
    return props.func($(e.target).data('type'));
    // return $(e.target).data('type');
  }
  return(
    <div className='lNav'>
      <ul>
        {types.map((item) => {
          const active = item.path === state.type ? 'active' : '';
          return (
            <li key={item.path}>
              <a href={(home_dir) + 'works/type/' + (item.path)} className={'fontM ' + (active)} onClick={getType} key={item.path} data-type={item.path}>
                {item.name}
              </a>
            </li>
          )
				})}
      </ul>
    </div>
  );
}

const CategoriesComponent = (props) => {
  const state = props.state;
  const getCategory = (e) => {
    e.preventDefault();
    return props.func($(e.target).data('category'));
  }
  return(
    <div className="categoryList">
      <ul>
        {state.categories.map((item) => {
          const active = item.id == state.category ? 'active' : '';
          return (
            <li key={item.id}>
              <a href={(home_dir) + 'works/type/' + (state.type) + '/category/' + (item.id)} className={active} onClick={getCategory} key={item.id} data-category={item.id}>
                {item.name}
              </a>
            </li>
          )
        })}
      </ul>
    </div>
  );
}

const EntriesComponent = (props) => {
  const state = props.state;
  if (state.entries.length > 0) {
    return(
      <div className="worksWrapper">
        {state.entries.map((item) => {
          const url = !item.data.works_url_real ? item.data.works_url : item.data.works_url_real;
          const disabled = !item.data.works_url ? 'disabled' : '';
          return (
            <div key={item.id} className="item">
              <a href={url} target="_blank" className={'trOp01 ' + (disabled)}>
                <figure className="img">
                  <img
                    src={item.data.work_thm.jpg}
                    alt={item.title.rendered}
                  />
                </figure>
                <div className="content">
                  <div className="category">{item.data.category}</div>
                  <h4 className="title">{item.title.rendered}</h4>
                  <div className="url">{item.data.works_url}</div>
                </div>
              </a>
            </div>
          )
        })}
      </div>
    );
  } else {
    return(
      <div className="worksWrapper">
        <p>制作実績がありません。</p>
      </div>
    );
  }
}

const PagenationComponent = (props) => {
  const state = props.state;
  const t = parseInt(state.total);
  const tp = parseInt(state.totalPages);
  const p = parseInt(state.page);
  const getPage = (e) => {
    e.preventDefault();
    return props.func(e.currentTarget.dataset.page);
    // return $(e.target).data('type');
  }
  if (t > per_page) {
    const pages = [];
    for (let i = 1; i <= tp; i++) {
      pages.push({num: i});
    }
    const prev = tp > 1 && p != 1 ? <a className="prev page-numbers" href={(home_dir) + 'works/type/' + (state.type) + '/page/' + (p - 1)} onClick={getPage} data-page={(p - 1)}>PREV</a> : '';
    const next = tp > 1 && p != tp ? <a className="next page-numbers" href={(home_dir) + 'works/type/' + (state.type) + '/page/' + (p + 1)} onClick={getPage} data-page={(p + 1)}>NEXT</a> : '';
    return(
      <nav className="navigation pagination">
        <div className="nav-links">
          {prev}
          {pages.map((item) => {
            if (p === item.num) {
              return(
                <span key={item.num} aria-current="page" className="page-numbers current">{item.num}</span>
              );
            } else {
              return(
                <a key={item.num} className="page-numbers" href={(home_dir) + 'works/type/' + (state.type) + '/page/' + (item.num)} onClick={getPage} data-page={item.num}>{item.num}</a>
              );
            }
          })}
          {next}
        </div>
      </nav>
    );
  } else {
    return null;
  }
}

if (typeof isPreview === 'undefined' || !isPreview) {
  ReactDOM.render(
    <Entries />,
    document.getElementById('js-container')
  );
}
