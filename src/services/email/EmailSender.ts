import fs from 'fs'
import ejs from 'ejs'

export interface IMailOptions {
    from: IEmailData
    subject?: string
    data?: any
    to?: IEmailData | string
    html?: string
}

export interface IEmailData {
    email: string
    name: string
}

export class EmailSenderService {

    template_dir = __dirname + '/../../../views/emails/'

    public options: IMailOptions = {
        from: {
            name: 'Antridoc',
            email: 'admin@antridoc.com'
        }
    }

    async send(): Promise<void> {}

    generateTemlate(template: string){
        const fileTemplate = fs.readFileSync(this.template_dir + template +'.ejs', 'utf-8')
        return ejs.render(fileTemplate, this.options)
    }

    async welcomeEmail(to: IEmailData | string) {

        this.options.subject = 'Wellcome to Antridoc'
        this.options.to = to
        this.options.html = this.generateTemlate('welcome')

        return await this.send()
    }

    async verifyEmail(to: IEmailData | string, aditionalLinks?: string) {

        this.options.subject = 'Email verify'
        this.options.to = to
        this.options.data = { aditionalLinks }
        this.options.html = this.generateTemlate('verify')

        return await this.send()
    }

    async forgotPassword(to: IEmailData | string, pin?: string) {

        this.options.subject = 'Forgot Password'
        this.options.to = to
        this.options.data = { pin }
        this.options.html = this.generateTemlate('resetPassword')

        return await this.send()
    }
     
}