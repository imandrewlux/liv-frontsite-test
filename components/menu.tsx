import { useEffect } from 'react';
import Link from 'next/link';
import MainMenu from "../components/mainMenu";



export default function TopMenu(props) {

	const clickFunction = (bong) =>{
      bong.preventDefault();
      let linkTarget = bong.target.getAttribute('href');
      let replacing = linkTarget.replace('#', '');
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
    }

		return(
			<div className="light menutop up">
				<div className="menutop-wrap">
					<p className="to-top">Index</p>
					<p className="site-title">Livia Foldes</p>
					<p>
						<a onClick={clickFunction} href="#info" >Info</a>
					</p>
					
					{/*<div className="hamburger"><span></span><span></span><span></span></div>*/}
				</div>
				<MainMenu projects={props.projects} contact={props.contact} />
	    	</div>

		)


};
