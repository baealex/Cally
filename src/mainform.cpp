#include "mainform.h"
#include "ui_mainform.h"
#include "setting.h"

MainForm::MainForm(QWidget *parent) :
    QMainWindow(parent),
    ui(new Ui::MainForm)
{
    setWindowFlags(Qt::FramelessWindowHint);

    ui->setupUi(this);
    ui->Day->setTextFormat(Qt::RichText);
    SettingData setData;
    move(setData.pos_x,setData.pos_y);
    this->setGeometry(this->geometry().x(),
                      this->geometry().y(),
                      setData.size_w,
                      setData.size_h);

    setWindowOpacity((double)setData.Opacity/100);

    QFile *file = new QFile;
    file->setFileName("UserData.txt");
    if(file->open(QIODevice::ReadOnly | QIODevice::Text))
    {
        mTD.LOAD();
        QString temp = mTD.Text_Data;
        ui->maintext->setPlainText(temp);
    }

    file->setFileName("IMGdata.dll");
    if(file->open(QIODevice::ReadOnly | QIODevice::Text))
    {
        mIMG_LOAD();
    }

    Month_Display();
    ui->Month->setText(This_Month);

    Month_Day_Calculator();
    ui->Day->setText(Month_Day);
}

void MainForm::Month_Display()
{
    QDate *date = new QDate;
    QDate THIS_MONTH = date->currentDate();

    if(THIS_MONTH.month()>9)
    {
        This_Month = QString::number(THIS_MONTH.month());
    }
    else
    {
        This_Month = "0" + QString::number(THIS_MONTH.month());
    }
}

void MainForm::Month_Day_Calculator()
{
    QDate *date = new QDate;
    QDate Today = date->currentDate();

    int year = Today.year();
    int AllDay = (year-1)*365 + (year-1)/4 - (year-1)/100 + (year-1)/400;

    int month = Today.month();
    switch (month-1)
    {
        case 12:
            AllDay += 31;
        case 11:
            AllDay += 30;
        case 10:
            AllDay += 31;
        case 9:
            AllDay += 30;
        case 8:
            AllDay += 31;
        case 7:
            AllDay += 31;
        case 6:
            AllDay += 30;
        case 5:
            AllDay += 31;
        case 4:
            AllDay += 30;
        case 3:
            AllDay += 31;
        case 2:
            AllDay += 28;
            if(year%4==0 && year%100!=0 || year%400==0)
                AllDay += 29;
        case 1:
            AllDay += 31;

    }

    for(int i = 1;i <= 31;i++)
    {
        switch ((AllDay+i)%7) {
        case 0:
            Month_Day.append("<font color='red'> "+QString::number(i)+" </font>");
            break;
        case 1:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 2:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 3:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 4:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 5:
            Month_Day.append(" "+QString::number(i)+" ");
            break;
        case 6:
            Month_Day.append("<font color='blue'> "+QString::number(i)+" </font>");
            break;
        }
    }
}

MainForm::~MainForm()
{
    SettingData setData;
    setData.size_w = this->size().width();
    setData.size_h = this->size().height();
    setData.SAVE();
    delete ui;
}

/* Move */

void MainForm::mousePressEvent(QMouseEvent *event) {
   if (event->button() == Qt::LeftButton) {
      m_nMouseClick_X_Coordinate = event->x();
      m_nMouseClick_Y_Coordinate = event->y();
      isMouseDown = true;
   }
}

void MainForm::mouseReleaseEvent(QMouseEvent *event) {
   isMouseDown = false;
}

void MainForm::mouseMoveEvent(QMouseEvent *event) {
   if (isMouseDown == true) {
      SettingData setData;
      move(event->globalX()-m_nMouseClick_X_Coordinate,event->globalY()-m_nMouseClick_Y_Coordinate);
      setData.pos_x = event->globalX()-m_nMouseClick_X_Coordinate;
      setData.pos_y = event->globalY()-m_nMouseClick_Y_Coordinate;
      setData.SAVE();
   }
}

void MainForm::resizeEvent(QResizeEvent *event) {
    ui->label->setGeometry(QRect(ui->label->geometry().x(),
                                 ui->label->geometry().y(),
                                 ui->centralWidget->geometry().width(),
                                 ui->centralWidget->geometry().height()-0));
    ui->Month->setGeometry(QRect(ui->Month->geometry().x(),
                                 ui->centralWidget->geometry().height()-80,
                                 ui->Month->geometry().width(),
                                 ui->Month->geometry().height()));

    if(ui->centralWidget->geometry().width()<600)
    {
        font.setPixelSize(12);
        ui->Day->setFont(font);
    }
    else if(ui->centralWidget->geometry().width()>=600 && ui->centralWidget->geometry().width()<700)
    {
        font.setPixelSize(13);
        ui->Day->setFont(font);
    }
    else if(ui->centralWidget->geometry().width()>=700)
    {
        font.setPixelSize(14);
        ui->Day->setFont(font);
    }
    ui->Day->setGeometry(QRect(ui->Day->geometry().x(),
                               ui->Month->geometry().y()+40,
                               ui->centralWidget->geometry().width()-80,
                               ui->Day->geometry().height()));
    if(View == false){
        ui->text_btn->setGeometry(QRect(ui->centralWidget->geometry().width()-30,
                                            ui->centralWidget->geometry().height()-40,
                                            ui->setting_btn->geometry().width(),
                                            ui->setting_btn->geometry().height()));
        ui->setting_btn->setGeometry(QRect(ui->centralWidget->geometry().width()-50,
                                            ui->centralWidget->geometry().height()-40,
                                            ui->setting_btn->geometry().width(),
                                            ui->setting_btn->geometry().height()));
        ui->close_btn->setGeometry(QRect(ui->centralWidget->geometry().width()-70,
                                            ui->centralWidget->geometry().height()-40,
                                            ui->setting_btn->geometry().width(),
                                            ui->setting_btn->geometry().height()));
        ui->maintext->setGeometry(QRect(ui->maintext->geometry().x(),
                                        ui->centralWidget->geometry().height()-20,
                                        ui->centralWidget->geometry().width()-20,
                                        ui->maintext->geometry().height()));}
    else{
        ui->text_btn->setGeometry(QRect(ui->centralWidget->geometry().width()-30,
                                            ui->centralWidget->geometry().height()-40-Text_Layout,
                                            ui->setting_btn->geometry().width(),
                                            ui->setting_btn->geometry().height()));
        ui->setting_btn->setGeometry(QRect(ui->centralWidget->geometry().width()-50,
                                            ui->centralWidget->geometry().height()-40-Text_Layout,
                                            ui->setting_btn->geometry().width(),
                                            ui->setting_btn->geometry().height()));
        ui->close_btn->setGeometry(QRect(ui->centralWidget->geometry().width()-70,
                                            ui->centralWidget->geometry().height()-40-Text_Layout,
                                            ui->setting_btn->geometry().width(),
                                            ui->setting_btn->geometry().height()));
        ui->maintext->setGeometry(QRect(ui->maintext->geometry().x(),
                                        ui->centralWidget->geometry().height()-20-Text_Layout,
                                        ui->centralWidget->geometry().width()-20,
                                        ui->maintext->geometry().height()));}
}

void MainForm::on_text_btn_clicked()
{
    QPropertyAnimation *Text_Animation = new QPropertyAnimation(ui->maintext,"geometry"); Text_Animation->setDuration(200);
    QPropertyAnimation *But1_Animation = new QPropertyAnimation(ui->setting_btn,"geometry"); But1_Animation->setDuration(200);
    QPropertyAnimation *But2_Animation = new QPropertyAnimation(ui->text_btn,"geometry"); But2_Animation->setDuration(200);
    QPropertyAnimation *But3_Animation = new QPropertyAnimation(ui->close_btn,"geometry"); But3_Animation->setDuration(200);

    if(View == false)
    {
        Text_Animation->setStartValue(QRect(ui->maintext->geometry().x(),
                                            ui->maintext->geometry().y(),
                                            ui->maintext->geometry().width(),
                                            ui->maintext->geometry().height()));
        Text_Animation->setEndValue(QRect(ui->maintext->geometry().x(),
                                          ui->maintext->geometry().y()-Text_Layout,
                                          ui->maintext->geometry().width(),
                                          ui->maintext->geometry().height()));
        Text_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But1_Animation->setStartValue(QRect(ui->setting_btn->geometry().x(),
                                            ui->setting_btn->geometry().y(),
                                            ui->setting_btn->geometry().width(),
                                            ui->setting_btn->geometry().height()));
        But1_Animation->setEndValue(QRect(ui->setting_btn->geometry().x(),
                                          ui->setting_btn->geometry().y()-Text_Layout,
                                          ui->setting_btn->geometry().width(),
                                          ui->setting_btn->geometry().height()));
        But1_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But2_Animation->setStartValue(QRect(ui->text_btn->geometry().x(),
                                            ui->text_btn->geometry().y(),
                                            ui->text_btn->geometry().width(),
                                            ui->text_btn->geometry().height()));
        But2_Animation->setEndValue(QRect(ui->text_btn->geometry().x(),
                                          ui->text_btn->geometry().y()-Text_Layout,
                                          ui->text_btn->geometry().width(),
                                          ui->text_btn->geometry().height()));
        But2_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But3_Animation->setStartValue(QRect(ui->close_btn->geometry().x(),
                                            ui->close_btn->geometry().y(),
                                            ui->close_btn->geometry().width(),
                                            ui->close_btn->geometry().height()));
        But3_Animation->setEndValue(QRect(ui->close_btn->geometry().x(),
                                          ui->close_btn->geometry().y()-Text_Layout,
                                          ui->close_btn->geometry().width(),
                                          ui->close_btn->geometry().height()));
        But3_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        //ui->close_btn->setText((QString)0x025BD);

        Text_Animation->start();
        But1_Animation->start();
        But2_Animation->start();
        But3_Animation->start();
        View = true;
    }
    else
    {
        Text_Animation->setStartValue(QRect(ui->maintext->geometry().x(),
                                            ui->maintext->geometry().y(),
                                            ui->maintext->geometry().width(),
                                            ui->maintext->geometry().height()));
        Text_Animation->setEndValue(QRect(ui->maintext->geometry().x(),
                                          ui->maintext->geometry().y()+Text_Layout,
                                          ui->maintext->geometry().width(),
                                          ui->maintext->geometry().height()));
        Text_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But1_Animation->setStartValue(QRect(ui->setting_btn->geometry().x(),
                                            ui->setting_btn->geometry().y(),
                                            ui->setting_btn->geometry().width(),
                                            ui->setting_btn->geometry().height()));
        But1_Animation->setEndValue(QRect(ui->setting_btn->geometry().x(),
                                          ui->setting_btn->geometry().y()+Text_Layout,
                                          ui->setting_btn->geometry().width(),
                                          ui->setting_btn->geometry().height()));
        But1_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But2_Animation->setStartValue(QRect(ui->text_btn->geometry().x(),
                                            ui->text_btn->geometry().y(),
                                            ui->text_btn->geometry().width(),
                                            ui->text_btn->geometry().height()));
        But2_Animation->setEndValue(QRect(ui->text_btn->geometry().x(),
                                          ui->text_btn->geometry().y()+Text_Layout,
                                          ui->text_btn->geometry().width(),
                                          ui->text_btn->geometry().height()));
        But2_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        But3_Animation->setStartValue(QRect(ui->close_btn->geometry().x(),
                                            ui->close_btn->geometry().y(),
                                            ui->close_btn->geometry().width(),
                                            ui->close_btn->geometry().height()));
        But3_Animation->setEndValue(QRect(ui->close_btn->geometry().x(),
                                          ui->close_btn->geometry().y()+Text_Layout,
                                          ui->close_btn->geometry().width(),
                                          ui->close_btn->geometry().height()));
        But3_Animation->setEasingCurve(QEasingCurve::BezierSpline);

        //ui->close_btn->setText((QString)0x025B3);

        Text_Animation->start();
        But1_Animation->start();
        But2_Animation->start();
        But3_Animation->start();
        View = false;
    }
}

void MainForm::on_maintext_textChanged()
{
    mTD.Text_Data=ui->maintext->toPlainText();
    mTD.SAVE();
}

void MainForm::on_setting_btn_clicked()
{
    Setting set(*this,this);
    set.exec();
}

void MainForm::on_close_btn_clicked()
{
    close();
}

void MainForm::mIMG_LOAD() {
    IMGData mIMG;
    mIMG.LOAD();

    if(mIMG.LINK.contains(".gif")) {
        movie = new QMovie(mIMG.LINK);
        ui->label->setMovie(movie);
        movie->start();
    }
    else {
        ui->label->setPixmap(mIMG.LINK);
    }
    ui->label->setScaledContents(true);
}
