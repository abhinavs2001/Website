let didScroll = false;
const changeHeaderOn = 200;

const ids = ['#home', '#about', '#skills', '#projects', '#contact'];
const monthNames = [
	'January',
	'February',
	'March',
	'April',
	'May',
	'June',
	'July',
	'August',
	'September',
	'October',
	'November',
	'December',
];

const getArticleDOM = function (repo) {
	const content = repo.description;
	const repoLink = repo.url;
	const date = new Date(repo.createdAt);

	const pubDate = `${monthNames[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`;

	// let tags = repo.name + ',';
	// if (repo.languages.nodes) {
	// 	for (let i = 0; i < repo.languages.nodes.length; i++) {
	// 		// console.log(repo.languages.nodes[i].name);
	// 		tags += repo.languages.nodes[i].name + ',';
	// 	}
	// }
	let imgTag = `<img src="${repo.openGraphImageUrl}" class="projimg" loading="lazy" alt="${repo.name}">`;

	return `<div class="col-xs-12 col-sm-12 col-md-12 col-lg-12 col-xl-3 project box no-border no-padding">
                <a href="${repoLink}" target="_blank">
                    ${imgTag}
                    <div class="content">
                        <h5>${repo.name}</h5>
                        <p class="pub-date">${pubDate}</p>
                        <p class="description">${content}</p>
                    </div>
                </a>
            </div>`;
};

function get_repo() {
	const openSource = {
		githubConvertedToken: 'sUBVrqAzs6RF8gaSpfwHJmr15QYvhV1HIrs1',
		githubUserName: 'Paras-code-007',
	};

	const query_pinned_projects = {
		query: `
		query {
		user(login: "${openSource.githubUserName}") {
			pinnedItems(first: 6, types: REPOSITORY) {
			totalCount
			nodes{
				... on Repository{
				id
					name
					createdAt,
					url,
					description,
					isFork,
					openGraphImageUrl,
					languages(first:10){
						nodes{
						name
						}
					}
				}
			}
			}
		}
		}
	`,
	};

	const baseUrl = 'https://api.github.com/graphql';

	const headers = {
		'Content-Type': 'application/json',
		Authorization: 'bearer ghp_' + openSource.githubConvertedToken,
	};

	fetch(baseUrl, {
		method: 'POST',
		headers: headers,
		body: JSON.stringify(query_pinned_projects),
	})
		.then((response) => response.json())
		.then((x) => {
			console.log(x);
			const obj = x.data.user.pinnedItems.nodes;
			repos = obj;

			let reposDOM = '';

			for (const repo of repos) {
				reposDOM += getArticleDOM(repo);
			}

			$('#projects div.projects').prepend(reposDOM);
		})
		.catch((error) => console.log('Error occured in pinned projects', JSON.stringify(error)));
}

$(function () {
	$('body').tooltip({ selector: '[data-bs-toggle=tooltip]' });

	$('.dropdown-menu li a').on('click', function () {
		const text = $(this).text();
		const classname = text.substring(0, 2).toLowerCase();

		$('#dropdown-value').text(text);

		$('.' + (classname === 'en' ? 'ta' : 'en')).css('display', 'none');
		$('.' + classname).css('display', 'inline-block');
	});

	const scrollSpy = new bootstrap.ScrollSpy(document.body, {
		target: '#menu',
	});

	if (navigator.userAgent.match(/(iPod|iPhone|iPad|Android)/)) {
		$('#wrapper').toggleClass('toggled');
	}

	get_repo();

	$(window).on('load', function () {
		$('.loader-wrapper').fadeOut(300);
	});

	$('#menu-toggle').on('click', function (e) {
		e.preventDefault();
		$('#wrapper').toggleClass('toggled');
	});

	$('.sidebar-heading').on('click', function (e) {
		e.preventDefault();
		$('#wrapper').toggleClass('toggled');
	});

	$('.navbar-brand').on('click', function (e) {
		const id = this.href.split('#')[1];
		addNavBg('#' + id);
		$('#wrapper').toggleClass('toggled');
	});

	let curr = 0;

	$('body').on('keydown', function (e) {
		if (e.code === 'ArrowDown') {
			curr += 1;
			if (curr >= ids.length) curr = ids.length - 1;
		} else if (e.code === 'ArrowUp') {
			curr -= 1;
			if (curr < 0) curr = 0;
		} else if (e.code === 'Escape') {
			$('#wrapper').toggleClass('toggled');
		}

		if (e.code === 'ArrowDown' || e.code === 'ArrowUp') {
			addNavBg(ids[curr]);
			$('html, body').animate(
				{
					scrollTop: $(ids[curr]).offset().top,
				},
				100,
				'easeOutBounce'
			);
		}
	});

	$('a').on('click', function (event) {
		if (this.hash !== '') {
			event.preventDefault();

			const hash = this.hash;

			addNavBg(hash);

			$('body').animate(
				{
					scrollTop: $(hash).offset().top,
				},
				100,
				'swing',
				function () {
					window.location.hash = hash;
				}
			);

			$('#wrapper').toggleClass('toggled');
			$(hash + '-nav').addClass('active');
		}
	});

	window.addEventListener(
		'scroll',
		function (event) {
			if (!didScroll) {
				didScroll = true;
				setTimeout(scrollPage, 250);
			}
		},
		false
	);
});

const addNavBg = function (id) {
	if (id === '#home') {
		$('.navbar').removeClass('navbar-bg');
	} else {
		$('.navbar').addClass('navbar-bg');
	}
};

function scrollPage() {
	const sy = scrollY();
	if (sy >= changeHeaderOn) {
		$('.navbar').addClass('navbar-bg');
	} else {
		$('.navbar').removeClass('navbar-bg');
	}
	didScroll = false;
}

function scrollY() {
	return window.pageYOffset || document.documentElement.scrollTop;
}
