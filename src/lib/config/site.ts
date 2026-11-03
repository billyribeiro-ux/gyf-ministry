// src/lib/config/site.ts
import { PUBLIC_SITE_URL } from '$app/env/public';

const normalizedSiteUrl = (PUBLIC_SITE_URL || 'https://growyourfaithministries.org').replace(
	/\/+$/,
	''
);

export const siteConfig = {
	// Change PUBLIC_SITE_URL in .env (e.g., PUBLIC_SITE_URL="https://yournewdomain.org")
	// Every canonical tag, OpenGraph URL, JSON-LD @id, sitemap entry, and robots.txt rule
	// automatically recalculates from this single source of truth.
	url: normalizedSiteUrl,
	domain: normalizedSiteUrl.replace(/^https?:\/\//, ''),
	name: 'Grow Your Faith Ministries',
	alternateName: 'Grow Your Faith Ministry',
	shortName: 'GYFM',
	foundingYear: '2014',
	slogan: 'Helping individuals find hope since 2014',
	description:
		'Founded in 2014 by Courtney Ribeiro, Grow Your Faith Ministries helps individuals restore their shattered dreams and God-given purpose through weekly Friday mentorship and annual Thanksgiving and Christmas community outreach providing hot meals, coats, hats, mittens, and blankets for children.',
	founder: {
		name: 'Courtney Ribeiro',
		role: 'Founder & Ministry Leader',
		parentOrgName: 'MWC Digital Agency',
		parentOrgUrl: 'https://mwcdigitalagency.com',
		coachingUrl: 'https://marketingwithcourtney.com',
		legacyMinistryUrl: 'https://mwcdigitalagency.com/grow-your-faith-ministry/'
	},
	location: {
		city: 'Wolcott',
		counties: ['New Haven County', 'Hartford County'],
		citiesServed: ['Wolcott', 'Waterbury', 'New Haven', 'Hartford'],
		region: 'Greater Waterbury & Central Connecticut',
		state: 'CT',
		stateFull: 'Connecticut'
	},
	seasonalCampaign: {
		name: '2026 Holiday Outreach Active (Nov 26 – Jan 4)',
		window: 'Thanksgiving through January 4',
		startDate: '2026-11-26',
		endDate: '2027-01-04',
		daysCount: 40,
		items: ['Hot Holiday Meals', 'Winter Coats', 'Hats', 'Mittens', 'Blankets']
	},
	routes: [
		{
			path: '/',
			label: 'Home',
			title: 'Grow Your Faith Ministries | Restoring Hope & Purpose (CT)',
			description:
				'Founded by Courtney Ribeiro in 2014, Grow Your Faith Ministries restores shattered dreams through weekly Friday mentorship and holiday community outreach.',
			priority: '1.0',
			changefreq: 'weekly'
		},
		{
			path: '/about',
			label: 'About',
			title: 'About Courtney Ribeiro & Our Mission | Grow Your Faith Ministries',
			description:
				'Learn how Courtney Ribeiro founded Grow Your Faith Ministries in 2014, structuring a 4-day workweek and 40-day holiday sabbatical to serve Connecticut communities.',
			priority: '0.9',
			changefreq: 'monthly'
		},
		{
			path: '/programs/friday-ministry',
			label: 'Friday Ministry',
			title: 'Friday Outreach & Faith Mentorship | Grow Your Faith Ministries',
			description:
				'Every Friday year-round is set aside exclusively to minister to those in need through 1-on-1 spiritual encouragement, life-purpose coaching, and community care in CT.',
			priority: '0.9',
			changefreq: 'weekly'
		},
		{
			path: '/programs/holiday-outreach',
			label: 'Holiday Outreach',
			title: 'Thanksgiving Meal & Kids Winter Coat Drive | Grow Your Faith Ministries',
			description:
				'From Thanksgiving through January 4, help us serve hot holiday meals and provide brand-new winter coats, hats, mittens, and blankets for children across Connecticut.',
			priority: '0.95',
			changefreq: 'daily'
		},
		{
			path: '/restore-your-purpose',
			label: 'Restore Your Purpose',
			title: 'Restore Your Dreams & God-Given Purpose | Grow Your Faith Ministries',
			description:
				'Discover the 3-step Mustard Seed Framework to unbury your vision, reclaim your identity in Christ, and steward your God-given talents beyond current circumstances.',
			priority: '0.85',
			changefreq: 'monthly'
		},
		{
			path: '/prayer-and-support',
			label: 'Prayer & Support',
			title: 'Request Prayer or Holiday Outreach Support | Grow Your Faith Ministries',
			description:
				'Submit a confidential prayer request, book a Friday encouragement call, or register a family in need for Thanksgiving and Christmas meals and children’s winter coats.',
			priority: '0.9',
			changefreq: 'weekly'
		},
		{
			path: '/partner',
			label: 'Partner & Donate',
			title: 'Partner With Us & Sponsor Outreach | Grow Your Faith Ministries',
			description:
				'With the help and support of clients and partners like you, 100% of outreach contributions directly fund hot holiday meals and brand-new winter gear for children.',
			priority: '0.95',
			changefreq: 'weekly'
		},
		{
			path: '/resources',
			label: 'Resources',
			title: 'Faith & Purpose Devotionals & Impact Recaps | Grow Your Faith Ministries',
			description:
				'Read mustard-seed faith devotionals, practical guides on rebuilding shattered dreams after adversity, and Connecticut community outreach impact reports.',
			priority: '0.8',
			changefreq: 'weekly'
		}
	],
	legacyPhotos: {
		logo: '/images/gyfm-logo.webp',
		businessMinistry: '/images/courtney-praying-clean.webp',
		mwcMinistry2: '/images/courtney-outreach-car-clean.webp',
		picForMinistryPage: '/images/gallery/carousel2-5.webp',
		carousel1: [
			{
				url: '/images/gallery/carousel1-1.webp',
				legacyUrl: 'https://mwcdigitalagency.com/wp-content/uploads/2021/06/Image-from-iOS-1.jpg',
				tag: 'Community Outreach • Connecticut',
				aspect: 'landscape',
				focus: 'center 22%',
				alt: 'Courtney Ribeiro serving families during Grow Your Faith Ministries outreach in Connecticut'
			},
			{
				url: '/images/gallery/carousel1-2.webp',
				legacyUrl:
					'https://mwcdigitalagency.com/wp-content/uploads/2019/10/Thanksgiving-2018-3.jpg',
				tag: 'Thanksgiving Meal Preparation',
				aspect: 'landscape',
				focus: 'center 28%',
				alt: 'Thanksgiving community meal preparation and volunteer service in Greater Waterbury CT'
			},
			{
				url: '/images/gallery/carousel1-3.webp',
				legacyUrl:
					'https://mwcdigitalagency.com/wp-content/uploads/2019/10/Thanksgiving-2018-2.jpg',
				tag: 'Holiday Meal Delivery',
				aspect: 'landscape',
				focus: 'center 25%',
				alt: 'Delivering hot Thanksgiving meals to neighbors in need across Connecticut'
			},
			{
				url: '/images/gallery/carousel1-4.webp',
				legacyUrl:
					'https://mwcdigitalagency.com/wp-content/uploads/2019/10/Thanksgiving-2018-1.jpg',
				tag: 'Holiday Outreach Tables',
				aspect: 'landscape',
				focus: 'center 30%',
				alt: 'Holiday outreach tables stocked with warm meals and winter supplies'
			},
			{
				url: '/images/gallery/carousel1-5.webp',
				legacyUrl: 'https://mwcdigitalagency.com/wp-content/uploads/2017/08/ministry_work__4.png',
				tag: 'Friday Ministry & Mentorship',
				aspect: 'landscape',
				focus: 'center 20%',
				alt: 'Friday community ministry and faith encouragement outreach session'
			},
			{
				url: '/images/gallery/carousel1-6.webp',
				legacyUrl: 'https://mwcdigitalagency.com/wp-content/uploads/2017/08/ministry_work_2.png',
				tag: 'Hands-On Community Care',
				aspect: 'landscape',
				focus: 'center 22%',
				alt: 'Sharing the love of Christ through hands-on community service'
			},
			{
				url: '/images/gallery/carousel1-7.webp',
				legacyUrl: 'https://mwcdigitalagency.com/wp-content/uploads/2017/08/ministry_work__3.png',
				tag: 'Partner-Funded Outreach',
				aspect: 'landscape',
				focus: 'center 25%',
				alt: 'Partner-funded outreach supplies ready for local families'
			},
			{
				url: '/images/gallery/carousel1-8.webp',
				legacyUrl:
					'https://mwcdigitalagency.com/wp-content/uploads/2021/06/Food-for-those-in-need.jpg',
				tag: 'Hot Holiday Food Packages',
				aspect: 'landscape',
				focus: 'center 30%',
				alt: 'Hot holiday food packages prepared for families in need'
			}
		],
		carousel2: [
			{
				url: '/images/gallery/carousel2-1.webp',
				legacyUrl: 'https://mwcdigitalagency.com/wp-content/uploads/2017/08/ministry_work__6.png',
				tag: 'Street Ministry • “Honk If You Love Jesus”',
				aspect: 'portrait',
				focus: 'center 15%',
				alt: 'Children winter coats, hats, mittens, and blankets drive in Connecticut'
			},
			{
				url: '/images/gallery/carousel2-2.webp',
				legacyUrl:
					'https://mwcdigitalagency.com/wp-content/uploads/2017/08/collecting_money_for_the_homeless_.png',
				tag: 'Friday Outreach • Supporting Unhoused Neighbors',
				aspect: 'portrait',
				focus: 'center 15%',
				alt: 'Collecting funds and supplies for unhoused neighbors during Friday outreach'
			},
			{
				url: '/images/gallery/carousel2-3.webp',
				legacyUrl: 'https://mwcdigitalagency.com/wp-content/uploads/2017/08/ministry_work__5.png',
				tag: 'Prayer & Scripture Encouragement',
				aspect: 'portrait',
				focus: 'center 15%',
				alt: 'Community members gathering for prayer and encouragement'
			},
			{
				url: '/images/gallery/carousel2-4.webp',
				legacyUrl: 'https://mwcdigitalagency.com/wp-content/uploads/2019/10/IMG_0615.jpg',
				tag: 'Children’s Winter Warmth & Gifts',
				aspect: 'portrait',
				focus: 'center 18%',
				alt: 'Holiday gift and winter warmth distribution for local children'
			},
			{
				url: '/images/gallery/carousel2-5.webp',
				legacyUrl:
					'https://mwcdigitalagency.com/wp-content/uploads/2021/06/Pic-for-ministry-page.png',
				tag: 'Courtney Ribeiro • Founder Outreach',
				aspect: 'portrait',
				focus: 'center 15%',
				alt: 'Courtney Ribeiro and Grow Your Faith Ministries outreach team in action'
			}
		]
	}
} as const;

export function getCanonicalUrl(path: string = '/'): string {
	const cleanPath = path.startsWith('/') ? path : `/${path}`;
	return `${siteConfig.url}${cleanPath}`;
}

export function getSchemaGraph() {
	return {
		'@context': 'https://schema.org',
		'@graph': [
			{
				'@type': 'NGO',
				'@id': `${siteConfig.url}/#organization`,
				name: siteConfig.name,
				alternateName: siteConfig.alternateName,
				foundingDate: siteConfig.foundingYear,
				url: `${siteConfig.url}/`,
				logo: `${siteConfig.url}/images/gyfm-logo.webp`,
				image: `${siteConfig.url}/images/gyfm-holiday-outreach-hero.webp`,
				description: siteConfig.description,
				slogan: siteConfig.slogan,
				founder: {
					'@type': 'Person',
					'@id': `${siteConfig.url}/#founder`,
					name: siteConfig.founder.name,
					jobTitle: siteConfig.founder.role,
					worksFor: {
						'@type': 'Organization',
						name: siteConfig.founder.parentOrgName,
						url: siteConfig.founder.parentOrgUrl
					}
				},
				areaServed: {
					'@type': 'State',
					name: siteConfig.location.stateFull
				},
				knowsAbout: [
					'Christian Mentorship',
					'Faith-Based Life Restoration',
					'Holiday Community Outreach',
					"Children's Winter Coat Drives",
					'Thanksgiving and Christmas Meal Ministry'
				],
				potentialAction: {
					'@type': 'DonateAction',
					target: {
						'@type': 'EntryPoint',
						urlTemplate: `${siteConfig.url}/partner`
					}
				}
			},
			{
				'@type': 'FAQPage',
				'@id': `${siteConfig.url}/#faq`,
				mainEntity: [
					{
						'@type': 'Question',
						name: 'What is the main goal of Grow Your Faith Ministries?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: "Founded in 2014 by Courtney Ribeiro, Grow Your Faith Ministries' main goal is to help individuals restore their buried dreams, goals, and visions, teaching them that their lives have God-given meaning and purpose far beyond their current circumstances."
						}
					},
					{
						'@type': 'Question',
						name: 'How does the Thanksgiving and Christmas outreach work?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'Every year from Thanksgiving through January 4, founder Courtney Ribeiro steps away from business operations to serve the community directly—providing hot holiday meals and purchasing brand-new coats, hats, mittens, and blankets for children in need.'
						}
					},
					{
						'@type': 'Question',
						name: 'What is the Friday Ministry program?',
						acceptedAnswer: {
							'@type': 'Answer',
							text: 'Every Friday year-round is dedicated exclusively to ministering to individuals in need through one-on-one spiritual encouragement, vision restoration mentorship, and community outreach.'
						}
					}
				]
			}
		]
	};
}
