/**
 * ================================================
 *
 * [works]
 *
 * ================================================
 */
let rTimer = false,
  isFirst = true;

let search = {
  type: '',
  cat: '',
  isSearch: false,
  isAllowSearch: false
};

let categories_json = home_dir + 'content/wp-json/wp/v2/' + type + '_works_category?_fields=id,count,name,slug';
let entries_json = home_dir + 'content/wp-json/wp/v2/' + type + '_works?_fields=id,title,data&per_page=21&' + type + '_works_category=' + cat;

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
    functions.loadPosts();

    setTimeout(function() {
      functions.adjust();
    }, 500);
  },
  adjust: function() {
    // if (!$.params.isRespMode) {
    //   $('.worksWrapper .item').find('.content').adjustSize();
    // } else {
    //   $('.worksWrapper .item').find('.content').height('auto');
    // }
  },
  loadCategories: function() {
    const url = 'https://azlink.localhost/content/wp-json/wp/v2/web_works_category?_fields=id,count,name,slug';

    const json = $.ajax({
      url: url,
    }).done(function(data, status, xhr) {
      console.log(data);
      console.log(xhr.getResponseHeader('X-WP-Total'));
      console.log(xhr.getResponseHeader('X-WP-TotalPages'));
    });
  },
  loadPosts: function() {
    const url = 'https://azlink.localhost/content/wp-json/wp/v2/web_works?_fields=id,title,data&per_page=21&web_works_category=2';

    const json = $.ajax({
      url: url,
    }).done(function(data, status, xhr) {
      console.log(data);
      console.log(xhr.getResponseHeader('X-WP-Total'));
      console.log(xhr.getResponseHeader('X-WP-TotalPages'));
    });
  }
};

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      type: type,
      cat: cat
    };
    this.onClick = this.onClick.bind(this);
  }
  loadCommentsFromServer() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
      context: this
    }).done((data, status, xhr) => {
      console.log(data);
      console.log(xhr.getResponseHeader('X-WP-Total'));
      console.log(xhr.getResponseHeader('X-WP-TotalPages'));
      this.setState({ data: data });
    }).fail((xhr, status, error) => {
      console.error(this.props.url, status, error.toString());
    });
	}
	componentDidMount() {
		this.loadCommentsFromServer();
	}
	onClick(key) {
		// const $el = $(key.target);
    // const cat = $el.data('category');
    // this.cat = cat;
    // console.log(this.cat);
	}
  render() {
    return (
      <ul>
				{this.state.data.map((result) => {
          const url = home_dir + 'works/type/' + type + '/cat/' + result.id;
          const active = result.id == cat ? 'active' : null;
					return (
						<li key={result.id}>
              <a href={url} className={active} data-category={result.id} onClick={this.onClick} key={result.id}>
                {result.name}
              </a>
						</li>
					);
				})}
			</ul>
    );
  }
};
ReactDOM.render(
  <Categories url={categories_json} />,
  document.getElementById('js-categories')
);

class Entries extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      type: type,
      cat: cat,
      data: []
    };
  }
  loadCommentsFromServer() {
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			cache: false,
      context: this
    }).done((data, status, xhr) => {
      console.log(data);
      console.log(xhr.getResponseHeader('X-WP-Total'));
      console.log(xhr.getResponseHeader('X-WP-TotalPages'));
      this.setState({ data: data });
    }).fail((xhr, status, error) => {
      console.error(this.props.url, status, error.toString());
    });
	}
	componentDidMount() {
		this.loadCommentsFromServer();
	}
  render() {
    return (
      <div className="worksWrapper">
				{this.state.data.map((result) => {
					return (
            <Item obj={result} key={result.id} />
					)
				})}
			</div>
    )
  }
}
ReactDOM.render(
  <Entries url={entries_json} />,
  document.getElementById('js-entries')
);

function Item(props) {
  return (
    <div key={props.obj.id} className='item'>
      <a href={props.obj.data.works_url} target='_blank' className='trOp01'>
        <figure className='img'>
          <picture>
            <source type='image/webp' srcSet={props.obj.data.work_thm.webp} />
            <img
              src={props.obj.data.work_thm.jpg}
              alt={props.obj.title.rendered}
            />
          </picture>
        </figure>
        <div className='content'>
          <div className='category'>{props.obj.data.category}</div>
          <h4 className="title">{props.obj.title.rendered}</h4>
          <div className="url">{props.obj.data.works_url}</div>
        </div>
      </a>
    </div>
  )
}
