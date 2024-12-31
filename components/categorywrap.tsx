import ProjectBlock from './projectblock';
import localFont from 'next/font/local';

const brushScript = localFont({
  src: [
    {
      path: '../fonts/Brush-Script.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
})

export default function CategoryIntro(props) {

		return(
			<div className="category-wrapper">	
				{props.cats && props.cats.map( (category, keyw) => {
					const descrip = category.catDesc.replace(/(?:\r\n|\r|\n)/g, '<br>');
					const descripEdit = `<span class='fancy ${brushScript.className}'>`+descrip.slice(0,1)+"</span>"+descrip.slice(1);
					const catLinkTig = category.category.replace(" ", "-")
					return (
						<div key={keyw} className="category-box">
						<div id={catLinkTig} className="category-intro">
							<h1 className="cat-title">
								{category.category}
							</h1>
							<p className="cat-date">
								{category.catDate}
							</p>
							<p className="cat-desc" dangerouslySetInnerHTML={{ __html: descripEdit}}>
							</p>
						</div>
						{category.projects && category.projects.map( (project, keys) => 
							 <ProjectBlock key={keys} id={project} project={props.proj} />
							)
						}
					</div>)
				})
			}
			</div>	
		)
};
