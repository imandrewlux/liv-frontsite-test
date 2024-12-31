import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from "next/head";
import localFont from 'next/font/local';

const exposure = localFont({
  src: [
    {
      path: '../fonts/Exposure/Exposure/Exposure.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../fonts/Exposure/Exposure-Italic/Exposure-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../fonts/Exposure/Exposure-bold/Exposure-bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../fonts/Exposure/Exposure-bold-Italic/Exposure-bold-Italic.woff2',
      weight: '700',
      style: 'italic',
    },
  ],
})

import { GetStaticProps } from "next";

import Layout from "../components/layout";
import TopMenu from "../components/menu";
import MainMenu from "../components/mainMenu";
import CategoryIntro from "../components/categorywrap";
import SiteIntro from "../components/siteintro";
import SiteInfo from "../components/siteinfo";

import { getStieOptions, getCats, getSettingsAPI , getProjectById, getInfo } from "../lib/api";

const flatListToHierarchical = (
        data = [],
        {idKey='id',parentKey='parentId',childrenKey='children'} = {}
    ) => {
        const tree = [];
        const childrenOf = {};
        data.forEach((item) => {
            const newItem = {...item};
            const { [idKey]: id, [parentKey]: parentId = 0 } = newItem;
            childrenOf[id] = childrenOf[id] || [];
            newItem[childrenKey] = childrenOf[id];
            parentId
                ? (
                    childrenOf[parentId] = childrenOf[parentId] || []
                ).push(newItem)
                : tree.push(newItem);
        });
        return tree;
    };

export const getStaticProps: GetStaticProps = async ({ preview = false }) => {
  const allSettings = await getSettingsAPI();
  const generalSettingss = allSettings.generalSettings;
  const menuSettings = allSettings.menuItems;
  const siteOptions = await getStieOptions();
  const siteIntro = siteOptions.siteIntro;
  const cats = await getCats();
  const pageInfo = await getInfo();

  const hierarchicalList  = flatListToHierarchical( menuSettings.nodes );

    var catArry = [];
    var projArr = [];
    var fullProjArr = [];
    hierarchicalList.forEach((cat) => {
      var organisedProjectss = {"category": "",
       "catDate": '',
       'catDesc': '',
       "projects": [
      ]}
      organisedProjectss.category = cat.label;
      organisedProjectss.catDate = cat.connectedObject.categoryOptions.date;
      organisedProjectss.catDesc = cat.connectedObject.description;
        cat.children.forEach((child) => {
          var id = child.connectedNode.node.projectId;
          var title = child.connectedNode.node.title;
          organisedProjectss.projects.push({'id': id, 'title': title});
        })
        catArry.push(organisedProjectss)
    });
    catArry.forEach((proj) => {
      proj.projects.forEach((id) => {
        projArr.push(id.id);
      })
    });

    for(const id in projArr ){
      const proj = await getProjectById(projArr[id]);
      fullProjArr.push({'id': projArr[id], 'proj' : proj.projects.edges[0].node});
    }

  return {
    props: {pageInfo, siteIntro, siteOptions, fullProjArr, catArry, hierarchicalList, cats, menuSettings, generalSettingss, preview },
    revalidate: 60,
  };
};


export default function Index({pageInfo, siteIntro, siteOptions, fullProjArr, catArry, hierarchicalList, cats, menuSettings, generalSettingss, preview }) {
    useEffect(() => {
      var lastScrollTop = 0;
      function scrollUpDown(){
        var st = window.pageYOffset || document.documentElement.scrollTop;
         if (st > lastScrollTop && lastScrollTop > 100) {
          document.querySelector('.menutop').classList.remove('up');
          document.querySelector('.menutop').classList.add('down');
         } else if (st < lastScrollTop) {
          document.querySelector('.menutop').classList.remove('down');
          document.querySelector('.menutop').classList.add('up');
         } 
         lastScrollTop = st <= 0 ? 0 : st;
      }
      function scrollURLThing(){
        let blocks =  document.querySelectorAll('.category-box .project-block');
        blocks.forEach(function(el, index, arr){
          if(el.classList.contains('url-update') && window.location.hash !== `#${el.id}`){
            let hash = el.id;
            window.history.replaceState(null, '', `#${hash}`);
          }else{

          }
        });
        
      }
      function activeScroll(){
       let blocks =  document.querySelectorAll('.category-box .project-block');
       let scrollTopping = window.scrollY;
        blocks.forEach(function(el, index, arr){
          let boxTop = (el as HTMLElement).offsetTop;
          let boxHeight = (el as HTMLElement).offsetHeight;
          boxHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-top'));
          boxHeight += parseInt(window.getComputedStyle(el).getPropertyValue('margin-bottom'));
          if( scrollTopping >= boxTop && (boxTop + boxHeight) > scrollTopping){
            el.classList.add('active');
            let menuS = document.querySelectorAll(`.main-menu .${el.id}`);
              menuS.forEach(function(el, index, arr){
                el.classList.add('active');
              });
          }else{
            el.classList.remove('active');
            let menuS = document.querySelectorAll(`.main-menu .${el.id}`);
              menuS.forEach(function(el, index, arr){
                el.classList.remove('active');
              });
          }
          let y = el.getBoundingClientRect().top + window.pageYOffset - 54;
          if(scrollTopping >= y && (y + boxHeight) > scrollTopping ){
            el.classList.add('url-update');
          }else{
            el.classList.remove('url-update');
          }
        })
      }
      /* maser scroll */
      document.addEventListener("scroll", function(){ 
         scrollUpDown();
         activeScroll();
         scrollURLThing();
      }, false);

      /* menu click */
      document.querySelector('.to-top').addEventListener('click', function(){
        const menu = document.querySelector('.menutop .main-menu');
        if( menu.classList.contains('open') ){
          menu.classList.remove('open');
          document.querySelector('.menutop').classList.remove('allup')
        }else if(!menu.classList.contains('open') ){
          menu.classList.add('open');
          document.querySelector('.menutop').classList.add('allup')
        }
        
      }, false);
      /* scroll to top */
      document.querySelector('.site-title').addEventListener('click', function() {
        const menu = document.querySelector('.menutop .main-menu');
        if( menu.classList.contains('open')){
            menu.classList.remove('open');
          }
        window.scrollTo({top: window.innerHeight, behavior: 'smooth'});
      }, false);


    }, [] );

    
  return (
    <Layout className={exposure.className} title={generalSettingss} meta={siteOptions} preview={preview}>
      <Head>
        <title>{generalSettingss.title}</title>
        <meta name="description" content={generalSettingss.description}/>
      </Head>
      <TopMenu indexShow={true} projects={hierarchicalList} contact={siteOptions}  />
      <SiteIntro intro={siteIntro} />
      <MainMenu  projects={hierarchicalList} contact={siteOptions} />
      <CategoryIntro cats={catArry} proj={fullProjArr} />
      <SiteInfo pageInfo={pageInfo} />
    </Layout>
  );
}

