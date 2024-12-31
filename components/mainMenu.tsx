import { useEffect } from 'react';

export default function MainMenu(props) {

	const clickFunction = (bong) =>{
      bong.preventDefault();
      let linkTarget = bong.target.getAttribute('href');
      let replacing = linkTarget.replace('#', '');
      let element = document.getElementById(replacing);
      console.log(`rep: ${replacing}; el: ${element.id}`);
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
			<div id="homeMenu" className="light main-menu">
			<div className="main-menu-wrap">
			{props.projects && props.projects.map( (stuff, keyw) => 
				{ const stuffID = stuff.label.replace(/[^a-zA-Z ]/g, "").replaceAll(" ", "-");
					return(
					<div key={keyw} className="category-wrap">
						<a onClick={clickFunction} href={`#${stuffID}`} className="title">{stuff.label}</a>
							{stuff.children && stuff.children.map( (child, keyz) => 
								{ const childID = child.label.replace(/[^a-zA-Z ]/g, "").replaceAll(" ", "-");
									return(
									<p className={childID} key={keyz}>
										<a onClick={clickFunction} href={`#${childID}`}>{child.label} </a>
									</p>)
								}
						)}
					</div>)
				}
			 )}
			<div className="category-wrap">
				<b className="titleNoLink">
				Contact
				</b>
				<p>
					<a href={`mailto:${props.contact.contactEmail}`}>{props.contact.contactEmail}</a>
				</p>
				<p>
					<a href={props.contact.socialLink}> {props.contact.socialLinkText}</a>
				</p>
				</div>
			</div>	
			</div>
		)


};
