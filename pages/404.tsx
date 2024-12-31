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
import FourOFour from '../components/fourofour';

import { getStieOptions, getCats, getSettingsAPI , getProjectById } from "../lib/api";

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
  const cats = await getCats();

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
    props: {siteOptions, fullProjArr, catArry, hierarchicalList, cats, menuSettings, generalSettingss, preview },
    revalidate: 60,
  };
};


export default function Index({siteOptions, fullProjArr, catArry, hierarchicalList, cats, menuSettings, generalSettingss, preview }) {
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
                el.classList.add('active')
              });
          }else{
            el.classList.remove('active');
            let menuS = document.querySelectorAll(`.main-menu .${el.id}`);
              menuS.forEach(function(el, index, arr){
                el.classList.remove('active')
              });
          }
        })
      }
      /* maser scroll */
      document.addEventListener("scroll", function(){ 
         scrollUpDown();
         activeScroll();
      }, false);

      /* menu click */
      document.querySelector('.to-top').addEventListener('click', function(){
        const menu = document.querySelector('.menutop .main-menu');
        if( menu.classList.contains('open') && lastScrollTop > 0){
          menu.classList.remove('open');
          document.querySelector('.menutop').classList.remove('allup')
        }else if(!menu.classList.contains('open') && lastScrollTop > 750){
          menu.classList.add('open');
          document.querySelector('.menutop').classList.add('allup')
        }
        
      }, false);
      /* scroll to top */
      document.querySelector('.site-title').addEventListener('click', function() {
        window.scrollTo({top: 0, behavior: 'smooth'});
      }, false);
    }, [] );

    useEffect(() => {
      /* click for anchorlink */
      document.querySelectorAll('a[href^="/#"').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
          e.preventDefault();
          let linkTarget = this.getAttribute('href');
          let replacing = linkTarget.replace('/#', '');
          let element = document.getElementById(replacing);
          let y = element.getBoundingClientRect().top + window.pageYOffset - 54;
          window.scrollTo({top: y, behavior: 'smooth'});
          document.querySelector('.menutop .main-menu').classList.remove('open');
          document.querySelector('.menutop').classList.remove('allup');
          document.querySelector('.menutop').classList.add('allup');
          setTimeout(() => {
            document.querySelector('.menutop').classList.add('up');
            document.querySelector('.menutop').classList.remove('down');
            document.querySelector('.menutop').classList.remove('allup');
          }, 1000);
        })
      })

      
    }, [] );
    
  return (
    <Layout className={exposure.className} title={generalSettingss} meta={siteOptions} preview={preview}>
      <Head>
        <title>{generalSettingss.title}</title>
        <meta name="description" content={generalSettingss.description}/>
      </Head>
      <TopMenu projects={hierarchicalList} contact={siteOptions}  />
      <FourOFour />
    </Layout>
  );
}

