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

export default function SiteIntro(props) {
	const introText = props.intro.replace(/(?:\r\n|\r|\n)/g, '<br>');

		return(
			<div className="site-intro-wrap">	
				<div className="site-intro" dangerouslySetInnerHTML={{ __html: introText}}>
				</div>
			</div>	
		)
};
