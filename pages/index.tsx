import Router from 'next/router'

const Index = () => null

Index.getInitialProps = async ({ res }) => {
    if (res) {
        res.writeHead(302, {
            Location: `/listProduct`
        })
        res.end()
    } 
    else
        Router.push(`/listProduct`)

    return {}
}
export default Index