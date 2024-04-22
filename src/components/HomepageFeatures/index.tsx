import clsx from 'clsx';
import Heading from '@theme/Heading';
import styles from './styles.module.css';

type FeatureItem = {
  title: string;
  description: JSX.Element;
};

const FeatureList: FeatureItem[] = [
  {
    title: '📚 最新技术栈',
    description: (
      <>
        基于React 18、Vite、TypeScript、 Ant Design 5.0等最新技术栈开发
      </>
    ),
  },
  {
    title: '👍 轻量化',
    description: (
      <>
        美观、现代化、干净的启动模板
      </>
    ),
  },
  {
    title: '🛠️ 丰富的组件',
    description: (
      <>
        大量封装好的内置基本组件
      </>
    ),
  },
  {
    title: '🎨 主题配置',
    description: (
      <>
        丰富的主题配置和黑暗主题配置
      </>
    ),
  },
  {
    title: '🔑 权限管理',
    description: (
      <>
        内置权限管理
      </>
    ),
  },
  {
    title: '📱 移动端适配',
    description: (
      <>
        所有页面均适配移动端
      </>
    ),
  },
];

function Feature({title, description}: FeatureItem) {
  return (
    <div className={clsx('col col--4 margin-bottom--lg')}>
      <div className="text--left padding-horiz--md">
        <Heading as="h3">{title}</Heading>
        <p className='text--light'>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures(): JSX.Element {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
